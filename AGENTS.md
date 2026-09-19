# AGENTS.md

本文件是本專案所有 AI coding agents 的主要操作規範（source of truth）。
README 用來說明「專案是什麼」；本文件用來規範「Agent 應如何修改專案」。

## Project

Devin Wu 的個人網站，使用 SvelteKit 2、Svelte 5、Tailwind CSS v4 與 Vite 建構，並以 GitHub Pages 部署。

專案採靜態輸出；新增功能時必須維持可 prerender 與 GitHub Pages 相容。

## Tech Stack

- SvelteKit 2
- Svelte 5 Runes API
- Tailwind CSS v4（`@tailwindcss/vite`）
- Vite 6
- `@sveltejs/adapter-static`
- `vite-plugin-pwa`
- npm
- GitHub Actions / GitHub Pages

Node.js 與部署細節以 `.github/workflows/deploy.yml` 為準。
不要自行將 package manager 改成 pnpm、yarn 或其他工具。

## Commands

```bash
npm ci
npm run dev
npm run build
npm run preview
```

目前沒有獨立的 lint 或 test script。

完成程式碼修改後，至少執行：

```bash
npm run build
```

不要宣稱執行過不存在或實際未執行的檢查。

## Architecture

### Static / prerender

專案使用 `adapter-static`，且 `src/routes/+layout.js` 啟用全站 prerender。

因此：

- 不要依賴常駐 Node.js server。
- 不要加入只能在 server runtime 執行的功能，除非任務本身明確要求重新設計部署架構。
- `window`、`document`、`localStorage`、clipboard 等 browser-only API 不得在 SSR / prerender 階段直接存取。
- Browser-only 邏輯應放在明確的 client-side 邊界，例如 `onMount`。
- 不要直接修改 `build/`；它是產生出的建構結果。

### Svelte

新增或修改 Svelte 元件時，沿用 Svelte 5 Runes：

- props：`$props()`
- mutable state：`$state()`
- derived state：`$derived()`
- side effects：`$effect()`

除非任務有明確需求，不要把現有 Runes 寫法改回舊式 reactive syntax。

### Styling

- 使用 Tailwind CSS v4。
- 專案沒有 `tailwind.config.js`。
- Theme 設定以 `src/app.css` 的 `@theme` 為準。
- 一般 UI 優先使用 Tailwind utility classes。
- 複雜動畫或特殊互動視覺可使用 Svelte scoped `<style>`。
- 不要為簡單樣式新增不必要的全域 CSS。

### Data and components

- 主頁內容優先從 `src/lib/data/site.js` 維護，不要把相同資料重複硬編碼到元件。
- 可重用 UI 應維持元件化。
- SVG 圖示維持為獨立 Svelte 元件，樣式優先由使用處透過 `class` 控制。

## Scope Discipline

- 修改前先閱讀相關檔案、直接依賴與必要設定。
- 只修改完成目前任務所必要的檔案與行。
- 不要順手重構、重新命名或整理無關程式碼。
- 不要因格式化而重寫未修改區域或整個檔案。
- 保留既有架構、命名與目錄慣例，除非任務明確要求調整。
- 發現額外問題時，優先在結果中指出，不要未經要求一併修正。
- 不要為了符合過期文件而修改本來正確的程式碼；先確認文件是否已落後。

## Coding Conventions

- 使用 UTF-8（無 BOM）。
- 使用 LF。
- 面向使用者的介面文字使用繁體中文。
- 註解應說明「為什麼」，不要單純重述程式碼。
- 不要提交 secrets、tokens、憑證、私密網址或本機專用設定。
- 環境變數範例使用 `.env.example`；不要提交實際 `.env`。

## Compatibility

修改下列項目時必須檢查向後相容性：

- `localStorage` keys 與資料格式
- 舊資料 migration
- 匯入 / 匯出格式
- PWA cache / service worker
- URL 與 GitHub Pages 路徑
- prerender / static build 行為

若資料格式必須變更，優先提供 migration 或相容讀取，而不是直接讓既有使用者資料失效。

## Dependencies

- 修改 dependency 時同步更新 lockfile。
- 不要只修改 `package.json`。
- 新增 dependency 前先確認現有平台或原生 Web API 無法合理完成需求。
- Browser-only 或大型套件若不是初始畫面必要功能，優先考慮動態載入，避免增加初始 bundle。

## Git and Deployment

部署 workflow 位於 `.github/workflows/deploy.yml`。

目前預設分支為 `master`，push 後由 GitHub Actions 建構並部署至 GitHub Pages。

修改 CI、Node.js 版本、部署路徑或 build output 時，以 workflow、`package.json`、`svelte.config.js` 與 `vite.config.js` 的實際設定為準，不要只依文件中的描述。

## Validation

完成任務前：

1. 檢查 diff，確認沒有無關變更。
2. 程式碼修改至少執行 `npm run build`。
3. Browser-only 功能確認不會在 prerender 階段執行。
4. 資料格式變更確認既有資料相容性。
5. Dependency 變更確認 lockfile 已同步。
6. 若有任何驗證無法執行，明確列出未驗證項目。

純 Markdown 文件修改不強制執行 build，但仍需檢查內容與 diff。

## Sources of Truth

遇到衝突時，分開判斷「指示」與「專案事實」：

- 任務需求：以使用者當前明確指示為最高優先。
- Agent 操作規範：以本 `AGENTS.md` 為準。
- 技術版本、指令、路徑、部署與實作現況：以實際程式碼、`package.json`、lockfile 與設定檔為準。
- `README.md` 與其他說明文件屬於參考資料；若與實作不一致，應指出可能已過期，而不是盲目修改程式碼配合文件。

`CLAUDE.md` 僅作為 Claude 的入口文件，不另外維護一份相同規範。
