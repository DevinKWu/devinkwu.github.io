# CLAUDE.md

## Project Overview

Devin Wu 的個人作品集網站，使用 SvelteKit 2 + Svelte 5 + Tailwind CSS v4 建構，透過 GitHub Pages 部署至自訂網域 `devinkwu.hom.tw`。

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5（使用 runes: `$state`, `$derived`, `$props`）
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
    └── +page.svelte                 # 主頁面（Hero / About / Skills / Projects / Contact）
```

## Key Architecture Decisions

- **單頁式設計**: 所有區塊在 `+page.svelte`，透過錨點導覽（#about, #skills, #projects, #contact）
- **資料集中管理**: 網站內容皆定義在 `src/lib/data/site.js`，修改資料只需編輯此檔案
- **聯絡表單**: 透過 GitHub Issues 實現，點擊送出會開啟預填好的 Issue 頁面（需 GitHub 帳號，訊息公開）
- **Tailwind v4 主題**: 在 `app.css` 中使用 `@theme` 定義 `--color-primary-*` 色階，元件中以 `primary-*` 使用
- **響應式設計**: 使用 Tailwind 斷點（`sm:`, `md:`, `lg:`），行動版漢堡選單

## Conventions

- 元件使用 Svelte 5 runes API（`$props()`, `$state()`, `$derived()`）
- 介面語言為繁體中文
- 所有樣式使用 Tailwind utility classes，不使用自訂 CSS class
- 圖示為獨立的 SVG 元件，接受 `class` prop
