import MonitorIcon from '$lib/components/icons/MonitorIcon.svelte';
import ServerIcon from '$lib/components/icons/ServerIcon.svelte';
import CogIcon from '$lib/components/icons/CogIcon.svelte';

export const siteConfig = {
  name: 'Devin Wu',
  title: 'Devin Wu - 個人網站',
  description: 'Devin Wu 的個人網站 - 網頁開發者',
  tagline: '打造優質的網頁體驗',
  email: 'devink0430@gmail.com',
  location: '台灣',
  github: {
    url: 'https://github.com/DevinKWu',
    username: '@DevinKWu',
    repo: 'DevinKWu/devinkwu.github.io'
  }
};

export const navLinks = [
  { href: '/#about', label: '關於我' },
  { href: '/#skills', label: '技能' },
  { href: '/#projects', label: '作品集' },
  { href: '/#contact', label: '聯絡我' },
  { href: '/poe', label: '擲杯' }
];

export const skills = [
  {
    title: '前端開發',
    description: '打造流暢的使用者介面與互動體驗',
    color: 'primary',
    icon: MonitorIcon,
    tags: ['HTML/CSS', 'JavaScript', 'TypeScript', 'Svelte', 'React', 'Tailwind CSS']
  },
  {
    title: '後端開發',
    description: '建構穩固的伺服器端架構與 API',
    color: 'green',
    icon: ServerIcon,
    tags: ['Node.js', 'Python', 'REST API', 'GraphQL', 'PostgreSQL', 'MongoDB']
  },
  {
    title: '開發工具',
    description: '善用工具提升開發效率與品質',
    color: 'purple',
    icon: CogIcon,
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
