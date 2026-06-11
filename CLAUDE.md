# CLAUDE.md

## Project Overview

Devin Wu 的個人作品集網站，使用 SvelteKit 2 + Svelte 5 + Tailwind CSS v4 建構，透過 GitHub Pages 部署至自訂網域 `devinkwu.hom.tw`。除主頁外另有兩個獨立工具頁：`/poe`（擲杯占卜）與 `/shuffle`（隨機排序）。

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5（使用 runes: `$state`, `$derived`, `$props`, `$effect`）
- **Styling**: Tailwind CSS v4（透過 `@tailwindcss/vite` plugin，無 `tailwind.config.js`）
- **Build**: Vite 6 + `@sveltejs/adapter-static`（全站靜態預渲染）
- **PWA**: `vite-plugin-pwa`（`registerType: 'prompt'`，離線快取 + 更新提示）
- **Deploy**: GitHub Actions → GitHub Pages
- **Runtime deps**: `js-yaml`、`xlsx`（僅 /shuffle 匯入匯出用，動態 import 延遲載入）

## Commands

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建構靜態網站到 build/
npm run preview  # 預覽 production build
```

## Project Structure

```
src/
├── app.css                          # Tailwind 入口 + @theme（primary 色階、--font-sans、--font-serif）
├── app.html                         # HTML 模板（Google Fonts 載入、LINE in-app browser 跳轉）
├── lib/
│   ├── components/
│   │   ├── ProjectCard.svelte       # 主頁：專案卡片
│   │   ├── SectionHeader.svelte     # 主頁：區塊標題
│   │   ├── SkillCard.svelte         # 主頁：技能卡片
│   │   ├── UpdatePrompt.svelte      # PWA：離線就緒 toast + 新版本更新提示
│   │   ├── PoeBlock.svelte          # /poe：單片筊杯 SVG（含擲杯動畫）
│   │   ├── PoeColorPicker.svelte    # /poe：筊杯顏色選擇（預設色 + 自訂 hex）
│   │   ├── PoeResult.svelte         # /poe：N=1 大型結果卡片
│   │   ├── PoeThrowList.svelte      # /poe：批次結果（逐筆清單 + 統計 + 連線）
│   │   ├── PoeResultGrid.svelte     # /poe：四種結果說明區（可折疊）
│   │   ├── PoeHistoryEntry.svelte   # /poe：單筆歷史紀錄（<details> 折疊）
│   │   ├── ShuffleHistoryEntry.svelte # /shuffle：單筆歷史紀錄（<details> 折疊 + 刪除）
│   │   ├── TagInput.svelte          # /shuffle：標籤輸入（已用標籤自動提示）
│   │   └── icons/                   # SVG 圖示元件（皆接受 class prop）
│   └── data/
│       ├── site.js                  # 主頁資料（個人資訊、技能、專案、導覽列、stats）
│       ├── poe.js                   # /poe：常數（DETAIL_LIMIT、HISTORY_LIMIT）、resultMap、
│       │                            #   顏色預設與 HSL 轉換、computeStats / computeStreaks
│       ├── shuffle.js               # /shuffle：常數與工具（makeId、shuffle、parseTags、formatTime）
│       └── shuffleIO.js             # /shuffle：匯入匯出（JSON/CSV/XLSX/YAML，動態載入第三方套件）
└── routes/
    ├── +layout.js                   # export const prerender = true
    ├── +layout.svelte               # 導覽列 + Footer + 捲動快捷按鈕 + UpdatePrompt
    ├── +page.svelte                 # 主頁面（Hero / About / Skills / Projects / Contact）
    ├── poe/+page.svelte             # 擲杯占卜互動頁面（/poe）
    └── shuffle/+page.svelte         # 隨機排序工具頁面（/shuffle）
```

## /poe 擲杯頁面架構

頁面狀態與流程在 `routes/poe/+page.svelte`，視覺與顯示拆分至 `Poe*` 元件，純邏輯與常數在 `lib/data/poe.js`。

### 狀態（+page.svelte）

| 變數 | 類型 | 說明 |
|------|------|------|
| `block1` / `block2` | `0\|1\|2\|null` | 當次第 1 擲的兩片筊杯面（0=陽、1=陰、2=立、null=未擲），驅動 SVG 動畫 |
| `currentThrows` | `{b1,b2,res}[]` | 當次批次所有擲的結果 |
| `throwCount` | `number` | 一次擲幾次（1–10000，預設 1；擲杯前會 clamp 非法輸入） |
| `isAnimating` | `boolean` | 動畫進行中旗標 |
| `history` | `HistoryEntry[]` | 歷史紀錄，存於 localStorage，上限 `HISTORY_LIMIT`（100） |
| `poeColorId` / `customHex` | `string` | 筊杯顏色選擇，存於 localStorage |

### Derived

- `resultInfo`：`currentThrows.length === 1` 時的結果卡片資料（N=1 模式用）
- `throwStats`：當次批次各結果計次 `{sheng,yin,xiao,li}`（`computeStats`）
- `streaks`：當次批次的連線紀錄（run-length encoding），格式 `{startIdx,result,count}[]`（`computeStreaks`）
- `poeColor`：依 `poeColorId` 計算的 SVG 漸層色值物件（自訂色由 `makeColorFromHex` 從 hex 推導色階）

### 結果顯示邏輯（以 `currentThrows.length` 判斷）

- **N=1**：`PoeResult` 大型結果卡片（名稱、副標、說明文字）
- **N>1，N ≤ DETAIL_LIMIT（50）**：`PoeThrowList` 逐筆清單 + 統計 bar + 連線紀錄
- **N>1，N > DETAIL_LIMIT**：略過逐筆 DOM 渲染，只顯示統計 bar + 連線紀錄（避免大量節點凍結 UI）

SVG 漸層定義（`pg-*`）集中在 `+page.svelte` 的隱藏 `<svg><defs>`，供所有 `PoeBlock` 引用。

### 歷史紀錄格式

```js
// 目前格式（批次，預計算）
{
  id, time, prayer,
  throwCount: number,
  stats: { sheng, yin, xiao, li },
  streaks: [{ startIdx, result, count }],
  throws: [{b1, b2, res}] | null,  // N > DETAIL_LIMIT 時為 null，節省 localStorage
}

// 舊格式（onMount 自動 migrate）
{ id, time, prayer, block1, block2, result }        // 最舊格式
{ id, time, prayer, throws: [{b1, b2, res}] }       // 中間格式
```

歷史顯示（`PoeHistoryEntry`）：單擲顯示 mini-block pair，批次顯示每擲標籤（有 `throws` 時）+ 統計 + 連線。祈求文字以 `<details>` 折疊。

## /shuffle 隨機排序頁面架構

輸入多個選項（標題、備註、標籤），以 Fisher-Yates 洗牌產生隨機順序。

- **選項格式**：`{ id, title, note, tags, createdAt, updatedAt }`，存於 localStorage（`shuffle-options`）
- **歷史紀錄**：`{ id, time, result, count }`，存於 localStorage（`shuffle-history`），上限 `HISTORY_LIMIT`（100），可逐筆刪除
- **標籤篩選**：`activeFilters` 為 AND 篩選，只影響清單與結果「顯示」，不影響排序對象（永遠對完整清單排序）
- **匯入/匯出**（`shuffleIO.js`）：支援 JSON / CSV / XLSX / YAML，檔案與剪貼簿（XLSX 僅檔案）。
  `js-yaml`、`xlsx` 以動態 `import()` 載入避免進入預渲染 bundle。匯入時正規化欄位、
  補缺漏 id/時間戳並去重，套用前以 modal 選擇「取代」或「追加（略過重複 id）」
- **編輯**：行內編輯，標題清空視為刪除該選項

## PWA

- `vite.config.js` 中以 `VitePWA` 設定 manifest（名稱、圖示、theme color）與 workbox 預快取
- `UpdatePrompt.svelte`（掛在 `+layout.svelte`）：動態 import `virtual:pwa-register`，
  顯示「已可離線使用」toast 與「網站有新版本可用」更新提示

## Key Architecture Decisions

- **單頁式設計**: 主頁所有區塊在 `+page.svelte`，透過錨點導覽（#about, #skills, #projects, #contact）
- **資料集中管理**: 主頁內容皆定義在 `src/lib/data/site.js`，修改資料只需編輯此檔案
- **聯絡表單**: 透過 GitHub Issues 實現，點擊送出會開啟預填好的 Issue 頁面（需 GitHub 帳號，訊息公開）
- **Tailwind v4 主題**: 在 `app.css` 中使用 `@theme` 定義 `--color-primary-*` 色階與字體變數；
  元件中以 `primary-*` 使用色彩、以 `font-serif` 套用 Noto Serif TC（工具頁裝飾文字）
- **字體載入**: Google Fonts（Inter、Noto Sans TC、Noto Serif TC）在 `app.html` 全站載入
- **響應式設計**: 使用 Tailwind 斷點（`sm:`, `md:`, `lg:`），行動版漢堡選單
- **捲動快捷按鈕**: `+layout.svelte` 中有兩個固定位置的圓形按鈕，透過 `$effect` 監聽被動滾動事件控制顯示：
  - **回到頂部**（`bottom-20 right-6`）：scrollY > 300px 時顯示，點擊平滑捲動至頂部；視覺上位於上方
  - **前往頁尾**（`bottom-6 right-6`）：距底部 > 300px 時顯示，點擊平滑捲動至底部；視覺上位於下方；hover 效果為向下微移（`hover:translate-y-0.5`）
- **工具頁 localStorage 模式**: `onMount` 讀取（含格式 migrate）→ 設定 loaded 旗標（非反應式）→
  `$effect` 在旗標為真時寫回，避免初始空狀態覆蓋已存資料

## Conventions

- 元件使用 Svelte 5 runes API（`$props()`, `$state()`, `$derived()`）
- 介面語言為繁體中文
- 主網站樣式使用 Tailwind utility classes，不使用自訂 CSS class
- 特殊互動頁面（如 /poe、/shuffle）可使用 Svelte scoped `<style>` 實作複雜視覺效果
- 圖示為獨立的 SVG 元件，接受 `class` prop
