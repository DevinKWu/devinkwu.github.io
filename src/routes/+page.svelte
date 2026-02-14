<svelte:head>
  <title>Devin Wu - 個人網站</title>
  <meta name="description" content="Devin Wu 的個人網站 - 網頁開發者" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet" />
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
      <span class="text-primary-600">Devin Wu</span>
    </h1>
    <p class="mt-6 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      一位熱愛打造優質網頁體驗的開發者
    </p>
    <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href="#projects"
        class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 transition-all duration-200"
      >
        查看作品集
        <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
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
    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
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
          <div>
            <div class="text-3xl font-bold text-primary-600">3+</div>
            <div class="text-sm text-gray-500 mt-1">年開發經驗</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-primary-600">10+</div>
            <div class="text-sm text-gray-500 mt-1">完成專案</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-primary-600">100%</div>
            <div class="text-sm text-gray-500 mt-1">學習熱忱</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Skills Section -->
<section id="skills" class="py-20 sm:py-28 bg-gray-50">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-sm font-semibold text-primary-600 uppercase tracking-wider">技能</h2>
      <h3 class="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">我的技術能力</h3>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        持續精進各種前後端技術，打造全方位的開發能力
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      <!-- Frontend -->
      <div class="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 class="text-xl font-bold text-gray-900 mb-3">前端開發</h4>
        <p class="text-gray-600 mb-4">打造流暢的使用者介面與互動體驗</p>
        <div class="flex flex-wrap gap-2">
          {#each ['HTML/CSS', 'JavaScript', 'TypeScript', 'Svelte', 'React', 'Tailwind CSS'] as skill}
            <span class="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              {skill}
            </span>
          {/each}
        </div>
      </div>

      <!-- Backend -->
      <div class="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
          </svg>
        </div>
        <h4 class="text-xl font-bold text-gray-900 mb-3">後端開發</h4>
        <p class="text-gray-600 mb-4">建構穩固的伺服器端架構與 API</p>
        <div class="flex flex-wrap gap-2">
          {#each ['Node.js', 'Python', 'REST API', 'GraphQL', 'PostgreSQL', 'MongoDB'] as skill}
            <span class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              {skill}
            </span>
          {/each}
        </div>
      </div>

      <!-- Tools & Others -->
      <div class="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h4 class="text-xl font-bold text-gray-900 mb-3">開發工具</h4>
        <p class="text-gray-600 mb-4">善用工具提升開發效率與品質</p>
        <div class="flex flex-wrap gap-2">
          {#each ['Git', 'Docker', 'CI/CD', 'Linux', 'VS Code', 'Figma'] as skill}
            <span class="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              {skill}
            </span>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Projects Section -->
<section id="projects" class="py-20 sm:py-28 bg-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-sm font-semibold text-primary-600 uppercase tracking-wider">作品集</h2>
      <h3 class="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">精選專案</h3>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        以下是我近期完成的一些專案作品
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each [
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
      ] as project}
        <div class="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-xl transition-all duration-300">
          <!-- Project Image Placeholder -->
          <div class="h-48 bg-gradient-to-br {project.color === 'primary' ? 'from-primary-400 to-primary-600' : project.color === 'green' ? 'from-green-400 to-green-600' : 'from-purple-400 to-purple-600'} flex items-center justify-center">
            <svg class="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>

          <div class="p-6">
            <h4 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {project.title}
            </h4>
            <p class="mt-2 text-sm text-gray-600 leading-relaxed">
              {project.description}
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              {#each project.tags as tag}
                <span class="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {tag}
                </span>
              {/each}
            </div>
            <div class="mt-5 flex items-center gap-4">
              <span class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors cursor-pointer">
                查看專案
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                原始碼
              </span>
            </div>
          </div>
        </div>
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
      <form class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <input
            type="text"
            id="name"
            name="name"
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
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors resize-none"
            placeholder="請輸入您的訊息..."
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 transition-all duration-200"
        >
          送出訊息
        </button>
      </form>
    </div>

    <!-- Contact Info -->
    <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
      <div class="text-center">
        <div class="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-900">Email</p>
        <p class="text-sm text-gray-500 mt-1">devin@example.com</p>
      </div>
      <div class="text-center">
        <div class="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-900">位置</p>
        <p class="text-sm text-gray-500 mt-1">台灣</p>
      </div>
      <div class="text-center">
        <div class="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-primary-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-900">GitHub</p>
        <p class="text-sm text-gray-500 mt-1">@DevinKWu</p>
      </div>
    </div>
  </div>
</section>
