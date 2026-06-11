<script>
  import { siteConfig, skills, projects, stats } from '$lib/data/site.js';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import SkillCard from '$lib/components/SkillCard.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import GitHubIcon from '$lib/components/icons/GitHubIcon.svelte';
  import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
  import LocationIcon from '$lib/components/icons/LocationIcon.svelte';
  import ArrowRightIcon from '$lib/components/icons/ArrowRightIcon.svelte';
  import ArrowDownIcon from '$lib/components/icons/ArrowDownIcon.svelte';

  let formName = $state('');
  let formEmail = $state('');
  let formMessage = $state('');

  function handleSubmit(e) {
    e.preventDefault();

    const title = encodeURIComponent(`[聯絡] 來自 ${formName} 的訊息`);
    const body = encodeURIComponent(
      `**姓名：** ${formName}\n**Email：** ${formEmail}\n\n---\n\n${formMessage}`
    );
    const labels = encodeURIComponent('contact');
    const url = `https://github.com/${siteConfig.github.repo}/issues/new?title=${title}&body=${body}&labels=${labels}`;

    window.open(url, '_blank');
  }
</script>

<svelte:head>
  <title>{siteConfig.title}</title>
  <meta name="description" content={siteConfig.description} />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
  <!-- Decorative blobs -->
  <div class="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
  <div class="absolute bottom-20 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

  <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
    <div class="mb-6">
      <div class="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
        👋 歡迎來到我的網站
      </div>
    </div>
    <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
      你好，我是
      <span class="text-primary-600">{siteConfig.name}</span>
    </h1>
    <p class="mt-6 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      一位熱愛{siteConfig.tagline}的開發者
    </p>
    <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href="#projects"
        class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 transition-all duration-200"
      >
        查看作品集
        <ArrowRightIcon class="ml-2 w-5 h-5" />
      </a>
      <a
        href="#contact"
        class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 hover:border-primary-400 hover:text-primary-600 transition-all duration-200"
      >
        聯絡我
      </a>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
    <ArrowDownIcon class="w-6 h-6 text-gray-400" />
  </div>
</section>

<!-- About Section -->
<section id="about" class="py-20 sm:py-28 bg-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <!-- Avatar / Visual -->
      <div class="flex justify-center lg:justify-start">
        <div class="relative">
          <div class="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-2xl flex items-center justify-center">
            <span class="text-7xl sm:text-8xl">👨‍💻</span>
          </div>
          <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-100 rounded-xl -z-10"></div>
          <div class="absolute -top-4 -left-4 w-16 h-16 bg-primary-200 rounded-lg -z-10"></div>
        </div>
      </div>

      <!-- Text Content -->
      <div>
        <h2 class="text-sm font-semibold text-primary-600 uppercase tracking-wider">關於我</h2>
        <h3 class="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
          熱衷於創造卓越的數位體驗
        </h3>
        <p class="mt-6 text-lg text-gray-600 leading-relaxed">
          我是一位全端網頁開發者，專注於使用現代化的技術棧打造高效能、響應式的網頁應用程式。
          我相信好的程式碼不僅能運作，更能創造令人愉悅的使用者體驗。
        </p>
        <p class="mt-4 text-lg text-gray-600 leading-relaxed">
          從前端的互動設計到後端的系統架構，我致力於在每個細節上追求品質與效率。
        </p>
        <div class="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {#each stats as stat}
            <div>
              <div class="text-3xl font-bold text-primary-600">{stat.value}</div>
              <div class="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Skills Section -->
<section id="skills" class="py-20 sm:py-28 bg-gray-50">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeader
      subtitle="技能"
      title="我的技術能力"
      description="持續精進各種前後端技術，打造全方位的開發能力"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {#each skills as skill, i}
        <div class={i === skills.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}>
          <SkillCard {...skill} />
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Projects Section -->
<section id="projects" class="py-20 sm:py-28 bg-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <SectionHeader
      subtitle="作品集"
      title="精選專案"
      description="以下是我近期完成的一些專案作品"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each projects as project}
        <ProjectCard {...project} />
      {/each}
    </div>
  </div>
</section>

<!-- Contact Section -->
<section id="contact" class="py-20 sm:py-28 bg-gradient-to-br from-primary-50 to-primary-100">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-sm font-semibold text-primary-600 uppercase tracking-wider">聯絡我</h2>
      <h3 class="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">讓我們一起合作</h3>
      <p class="mt-4 text-lg text-gray-600">
        如果你有任何合作想法或問題，歡迎隨時與我聯繫
      </p>
    </div>

    <div class="mt-12 max-w-lg mx-auto">
      <form class="space-y-6" onsubmit={handleSubmit}>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            bind:value={formName}
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
            placeholder="請輸入您的姓名"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            bind:value={formEmail}
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-1">訊息</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            bind:value={formMessage}
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors resize-none"
            placeholder="請輸入您的訊息..."
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 transition-all duration-200"
        >
          送出訊息（透過 GitHub Issue）
        </button>
        <p class="text-xs text-gray-500 text-center">
          點擊後將導向 GitHub 建立 Issue，需要 GitHub 帳號。<br />
          提交的訊息將會公開顯示，請勿填寫敏感個人資訊。
        </p>
      </form>
    </div>

    <!-- Contact Info -->
    <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
      <div class="text-center">
        <div class="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center mx-auto mb-3">
          <EmailIcon class="w-6 h-6 text-primary-700" />
        </div>
        <p class="text-sm font-medium text-gray-900">Email</p>
        <p class="text-sm text-gray-500 mt-1">{siteConfig.email}</p>
      </div>
      <div class="text-center">
        <div class="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center mx-auto mb-3">
          <LocationIcon class="w-6 h-6 text-primary-700" />
        </div>
        <p class="text-sm font-medium text-gray-900">位置</p>
        <p class="text-sm text-gray-500 mt-1">{siteConfig.location}</p>
      </div>
      <div class="text-center">
        <div class="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center mx-auto mb-3">
          <GitHubIcon class="w-6 h-6 text-primary-700" />
        </div>
        <p class="text-sm font-medium text-gray-900">GitHub</p>
        <p class="text-sm text-gray-500 mt-1">{siteConfig.github.username}</p>
      </div>
    </div>
  </div>
</section>
