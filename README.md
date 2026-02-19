# devinkwu.github.io

Devin Wu 的個人作品集網站，部署於 [devinkwu.hom.tw](https://devinkwu.hom.tw)。

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5（Runes API）
- **Styling**: Tailwind CSS v4（`@tailwindcss/vite`，無 `tailwind.config.js`）
- **Build**: Vite 6 + `@sveltejs/adapter-static`（全站靜態預渲染）
- **Deploy**: GitHub Actions → GitHub Pages

## 開發指令

```bash
npm install       # 安裝依賴
npm run dev       # 啟動開發伺服器
npm run build     # 建構靜態網站到 build/
npm run preview   # 預覽 production build
```

## 專案結構

```
src/
├── app.css                          # Tailwind 入口 + @theme 自訂色彩
├── app.html                         # HTML 模板
├── lib/
│   ├── components/
│   │   ├── ProjectCard.svelte
│   │   ├── SectionHeader.svelte
│   │   ├── SkillCard.svelte
│   │   └── icons/                   # EmailIcon / GitHubIcon / LocationIcon
│   └── data/
│       └── site.js                  # 所有網站內容（個人資訊、技能、專案）
└── routes/
    ├── +layout.svelte               # 導覽列 + Footer
    ├── +page.svelte                 # 主頁面（Hero / About / Skills / Projects / Contact）
    └── poe/
        └── +page.svelte             # 擲杯占卜互動頁面（/poe）
```

## 頁面

### 主頁面 `/`

單頁式設計，透過錨點導覽各區塊（`#about`、`#skills`、`#projects`、`#contact`）。網站內容集中管理於 `src/lib/data/site.js`，修改資料只需編輯此檔案。

聯絡表單透過 GitHub Issues 實現，點擊送出會開啟預填好的 Issue 頁面。

### 擲杯頁面 `/poe`

傳統台灣廟宇筊杯問卜儀式模擬，功能包含：

- 互動 SVG 筊杯動畫，支援自訂顏色（正紅、朱砂、深棗、自訂）
- 批次擲杯：一次可擲 1–10000 次，顯示每擲結果、統計、連線紀錄
- 大批次效能：N > 50 時略過逐筆 DOM 渲染，只顯示統計與連線摘要，避免 UI 卡頓
- 祈求欄位：可填寫問題，紀錄於歷史中並支援折疊展開
- 歷史紀錄：以批次為單位儲存於 `localStorage`，顯示第幾擲、統計、連線資訊；大批次只存預算結果不存原始資料
