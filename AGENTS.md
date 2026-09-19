# AGENTS.md

本文件是本專案所有 AI 開發工具與 coding agents 的主要開發指引（source of truth）。

## 專案概述

Devin Wu 的個人作品集網站，使用 SvelteKit 2、Svelte 5 與 Tailwind CSS v4 建構，透過 GitHub Pages 部署至自訂網域 `devinkwu.hom.tw`。

除主頁外，目前另有兩個互動工具頁：

- `/poe`：擲杯占卜
- `/shuffle`：隨機排序

## 技術棧

- Framework：SvelteKit 2 + Svelte 5
- Svelte API：Runes（`$state`、`$derived`、`$props`、`$effect`）
- Styling：Tailwind CSS v4，透過 `@tailwindcss/vite`
- Build：Vite 6
- Adapter：`@sveltejs/adapter-static`
- PWA：`vite-plugin-pwa`
- Deploy：GitHub Actions → GitHub Pages
- Runtime dependencies：`js-yaml`、`xlsx`
- Package manager：npm
- CI Node.js：22

## 常用指令

```bash
npm ci
npm run dev
npm run build
npm run preview
```

修改完成後至少執行：

```bash
npm run build
```

目前專案沒有獨立的 lint 或 test script。不要宣稱已執行不存在的檢查。

## 專案結構

```text
src/
├── app.css
├── app.html
├── lib/
│   ├── components/
│   │   ├── ProjectCard.svelte
│   │   ├── SectionHeader.svelte
│   │   ├── SkillCard.svelte
│   │   ├── UpdatePrompt.svelte
│   │   ├── Poe*.svelte
│   │   ├── ShuffleHistoryEntry.svelte
│   │   ├── TagInput.svelte
│   │   └── icons/
│   └── data/
│       ├── site.js
│       ├── poe.js
│       ├── shuffle.js
│       └── shuffleIO.js
└── routes/
    ├── +layout.js
    ├── +layout.svelte
    ├── +page.svelte
    ├── poe/+page.svelte
    └── shuffle/+page.svelte

static/                 # PWA / favicon 等靜態資源
.github/workflows/      # GitHub Pages 部署
```

## 核心架構規則

### 靜態網站

`src/routes/+layout.js` 設定：

```js
export const prerender = true;
```

專案使用 `adapter-static`，所有頁面都必須能在 build 時完成 prerender。

新增功能時：

- 不要依賴常駐 Node.js server。
- 不要加入只能在 server runtime 執行的功能，除非同時重新評估部署架構。
- Browser-only API（例如 `window`、`document`、`localStorage`、clipboard）必須避免在 SSR / prerender 階段直接存取。
- 必要時使用 `onMount` 或其他明確的 browser-side 邊界。

### Svelte 5

新增或修改元件時優先沿用目前的 Runes 寫法：

- props：`$props()`
- mutable state：`$state()`
- derived state：`$derived()`
- side effects：`$effect()`

不要在沒有必要的情況下把既有 Svelte 5 Runes 寫法改回舊式 reactive syntax。

### Tailwind CSS

- 使用 Tailwind CSS v4。
- 專案沒有 `tailwind.config.js`。
- Theme 定義集中在 `src/app.css` 的 `@theme`。
- 主站一般 UI 優先使用 Tailwind utility classes。
- `/poe`、`/shuffle` 等互動頁面若有複雜動畫或特殊視覺，可使用 Svelte scoped `<style>`。
- 不要為簡單樣式新增不必要的全域 CSS。

### 主頁資料

主頁可變內容集中於：

`src/lib/data/site.js`

修改個人資訊、技能、專案、導覽或統計資料時，優先修改資料來源，不要把相同資料重新硬編碼到元件。

### 圖示

SVG 圖示應維持獨立 Svelte 元件，並接受 `class` prop，讓尺寸與顏色由使用處控制。

## /poe 規則

主要分工：

- 頁面狀態與互動流程：`src/routes/poe/+page.svelte`
- 顯示元件：`src/lib/components/Poe*.svelte`
- 純邏輯、常數與統計：`src/lib/data/poe.js`

重要行為：

- `throwCount` 支援 1–10000。
- `DETAIL_LIMIT` 控制是否逐筆渲染大量結果。
- 大量結果不可無條件建立數千個 DOM 節點。
- 歷史紀錄存於 `localStorage`，並包含舊格式 migration。
- 不要破壞既有歷史資料相容性。
- SVG 漸層定義與 `PoeBlock` 的引用方式修改時必須一起驗證。

## /shuffle 規則

主要分工：

- 頁面狀態與互動流程：`src/routes/shuffle/+page.svelte`
- 共用邏輯：`src/lib/data/shuffle.js`
- 匯入匯出：`src/lib/data/shuffleIO.js`
- 顯示元件：`ShuffleHistoryEntry.svelte`、`TagInput.svelte`

重要行為：

- 排序使用 Fisher-Yates。
- 標籤篩選只影響顯示，不改變實際排序對象。
- 歷史紀錄與選項存於 `localStorage`。
- 匯入支援 JSON / CSV / XLSX / YAML。
- `js-yaml` 與 `xlsx` 應維持動態 `import()`，避免不必要地進入初始 bundle 或干擾 prerender。
- 修改匯入格式時須保留正規化、補 id / timestamp 與去重邏輯。

## PWA

PWA 設定位於 `vite.config.js`。

- `registerType` 目前為 `prompt`。
- `UpdatePrompt.svelte` 負責離線就緒與新版提示。
- 修改快取策略、manifest、圖示或更新流程後，要確認 `npm run build` 仍成功。
- 不要直接修改產生出的 `build/`；它是建構輸出且已被 gitignore。

## 修改原則

- 只修改完成任務所必要的檔案與行。
- 不要順手重構無關程式碼。
- 不要因格式化而重寫整個無關檔案。
- 保留既有命名與目錄慣例。
- 使用 UTF-8（無 BOM）與 LF。
- 使用繁體中文撰寫面向使用者的介面文字。
- 程式碼註解應描述「為什麼」，不要重述程式碼本身。
- 不要提交 secrets、token、私密網址或本機環境設定。
- `.env` 與 `.env.*` 已被忽略；若需要範例設定，使用 `.env.example`。

## 相容性與資料安全

涉及以下項目時，視為需要特別小心的變更：

- `localStorage` key 或資料結構
- 舊資料 migration
- 匯入 / 匯出格式
- PWA cache / service worker
- GitHub Pages 路徑
- static prerender 行為

若必須改變既有格式，優先提供向後相容 migration，而不是直接讓舊資料失效。

## Git 與部署

GitHub Pages workflow 位於：

`.github/workflows/deploy.yml`

目前：

- push 到 `master` 會觸發部署。
- CI 使用 Node.js 22。
- CI 執行 `npm ci` 與 `npm run build`。
- build artifact 來自 `build/`。

修改 dependency 時應同步更新 lockfile，不要只修改 `package.json`。

## 完成條件

完成任務前：

1. 檢查 diff，確認沒有無關變更。
2. 執行 `npm run build`。
3. 若修改 browser-only 功能，確認沒有在 prerender 階段直接存取 browser API。
4. 若修改 localStorage / import-export 格式，確認既有資料相容性。
5. 若無法執行某項驗證，清楚說明未驗證項目，不要推測已通過。

## 文件優先順序

若文件內容衝突，依下列優先順序判斷：

1. 使用者當前明確指示
2. `AGENTS.md`
3. 專案實際程式碼與設定
4. `README.md`

`CLAUDE.md` 僅作為 Claude 的入口文件，實際開發規範以本文件為準。
