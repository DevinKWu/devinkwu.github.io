export const siteConfig = {
  name: 'Devin Wu',
  title: 'Devin Wu - 個人網站',
  description: 'Devin Wu 的個人網站 - 網頁開發者',
  tagline: '打造優質的網頁體驗',
  email: 'devin@example.com',
  location: '台灣',
  github: {
    url: 'https://github.com/DevinKWu',
    username: '@DevinKWu',
    repo: 'DevinKWu/devinkwu.github.io'
  }
};

export const navLinks = [
  { href: '#about', label: '關於我' },
  { href: '#skills', label: '技能' },
  { href: '#projects', label: '作品集' },
  { href: '#contact', label: '聯絡我' }
];

export const skills = [
  {
    title: '前端開發',
    description: '打造流暢的使用者介面與互動體驗',
    color: 'primary',
    iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    tags: ['HTML/CSS', 'JavaScript', 'TypeScript', 'Svelte', 'React', 'Tailwind CSS']
  },
  {
    title: '後端開發',
    description: '建構穩固的伺服器端架構與 API',
    color: 'green',
    iconPath: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2',
    tags: ['Node.js', 'Python', 'REST API', 'GraphQL', 'PostgreSQL', 'MongoDB']
  },
  {
    title: '開發工具',
    description: '善用工具提升開發效率與品質',
    color: 'purple',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    iconPath2: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    tags: ['Git', 'Docker', 'CI/CD', 'Linux', 'VS Code', 'Figma']
  }
];

export const projects = [
  {
    title: '電子商務平台',
    description: '使用 SvelteKit 與 Tailwind CSS 打造的全功能電商網站，支援購物車、結帳與會員系統。',
    tags: ['SvelteKit', 'Tailwind', 'PostgreSQL'],
    color: 'primary'
  },
  {
    title: '任務管理工具',
    description: '具有拖放功能的看板式任務管理應用，支援即時同步與團隊協作。',
    tags: ['React', 'Node.js', 'WebSocket'],
    color: 'green'
  },
  {
    title: '個人部落格',
    description: '支援 Markdown 撰寫的靜態部落格系統，具備 SEO 優化與深色模式。',
    tags: ['SvelteKit', 'MDsveX', 'Vercel'],
    color: 'purple'
  }
];

export const stats = [
  { value: '3+', label: '年開發經驗' },
  { value: '10+', label: '完成專案' },
  { value: '100%', label: '學習熱忱' }
];
