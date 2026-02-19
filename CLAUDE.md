# CLAUDE.md

## Project Overview

Devin Wu 的個人作品集網站，使用 SvelteKit 2 + Svelte 5 + Tailwind CSS v4 建構，透過 GitHub Pages 部署至自訂網域 `devinkwu.hom.tw`。

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5（使用 runes: `$state`, `$derived`, `$props`, `$effect`）
- **Styling**: Tailwind CSS v4（透過 `@tailwindcss/vite` plugin，無 `tailwind.config.js`）
- **Build**: Vite 6 + `@sveltejs/adapter-static`（全站靜態預渲染）
- **Deploy**: GitHub Actions → GitHub Pages

## Commands

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建構靜態網站到 build/
npm run preview  # 預覽 production build
```

## Project Structure

```
src/
├── app.css                          # Tailwind 入口 + @theme 自訂色彩（primary 色階）
├── app.html                         # HTML 模板
├── lib/
│   ├── components/
│   │   ├── ProjectCard.svelte       # 專案卡片元件
│   │   ├── SectionHeader.svelte     # 區塊標題元件
│   │   ├── SkillCard.svelte         # 技能卡片元件
│   │   └── icons/                   # SVG 圖示元件
│   │       ├── EmailIcon.svelte
│   │       ├── GitHubIcon.svelte
│   │       └── LocationIcon.svelte
│   └── data/
│       └── site.js                  # 所有網站資料（個人資訊、技能、專案、導覽列）
└── routes/
    ├── +layout.js                   # export const prerender = true
    ├── +layout.svelte               # 導覽列 + Footer 共用佈局
    ├── +page.svelte                 # 主頁面（Hero / About / Skills / Projects / Contact）
    └── poe/
        └── +page.svelte             # 擲杯占卜互動頁面（/poe）
```

## /poe 擲杯頁面架構

### 狀態

| 變數 | 類型 | 說明 |
|------|------|------|
| `block1` / `block2` | `0\|1\|2\|null` | 當次第 1 擲的兩片筊杯面（0=陽、1=陰、2=立、null=未擲），驅動 SVG 動畫 |
| `currentThrows` | `{b1,b2,res}[]` | 當次批次所有擲的結果 |
| `throwCount` | `number` | 一次擲幾次（1–10，預設 1） |
| `isAnimating` | `boolean` | 動畫進行中旗標 |
| `history` | `HistoryEntry[]` | 歷史紀錄，存於 localStorage |

### Derived

- `resultInfo`：`currentThrows.length === 1` 時的結果卡片資料（N=1 模式用）
- `throwStats`：當次批次各結果計次 `{sheng,yin,xiao,li}`
- `streaks`：當次批次的連線紀錄（run-length encoding），格式 `{startIdx,result,count}[]`
- `poeColor`：依 `poeColorId` 計算的 SVG 漸層色值物件

### 結果顯示邏輯

- **N=1**：大型結果卡片（名稱、副標、說明文字）
- **N>1**：compact 清單（第N擲 + mini-block 標籤）+ 統計 bar + 連線紀錄

### 歷史紀錄格式

```js
// 新格式（批次）
{ id, time, prayer, throws: [{b1, b2, res}] }

// 舊格式（逐筆，onMount 自動 migrate）
{ id, time, prayer, block1, block2, result }
```

歷史顯示：單擲顯示 mini-block pair，批次顯示每擲標籤 + 統計 + 連線。祈求文字以 `<details>` 折疊。

## Key Architecture Decisions

- **單頁式設計**: 所有區塊在 `+page.svelte`，透過錨點導覽（#about, #skills, #projects, #contact）
- **資料集中管理**: 網站內容皆定義在 `src/lib/data/site.js`，修改資料只需編輯此檔案
- **聯絡表單**: 透過 GitHub Issues 實現，點擊送出會開啟預填好的 Issue 頁面（需 GitHub 帳號，訊息公開）
- **Tailwind v4 主題**: 在 `app.css` 中使用 `@theme` 定義 `--color-primary-*` 色階，元件中以 `primary-*` 使用
- **響應式設計**: 使用 Tailwind 斷點（`sm:`, `md:`, `lg:`），行動版漢堡選單
- **擲杯頁面（/poe）**: 獨立互動頁面，使用 Svelte scoped `<style>` 實作視覺效果，localStorage 儲存歷史紀錄，`$effect` 監聽狀態變更。支援批次擲杯（1–10 次）、連線紀錄、祈求折疊顯示

## Conventions

- 元件使用 Svelte 5 runes API（`$props()`, `$state()`, `$derived()`）
- 介面語言為繁體中文
- 主網站樣式使用 Tailwind utility classes，不使用自訂 CSS class
- 特殊互動頁面（如 /poe）可使用 Svelte scoped `<style>` 實作複雜視覺效果
- 圖示為獨立的 SVG 元件，接受 `class` prop
