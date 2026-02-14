<script>
  import '../app.css';

  let { children } = $props();
  let mobileMenuOpen = $state(false);

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMenu() {
    mobileMenuOpen = false;
  }

  const navLinks = [
    { href: '#about', label: '關於我' },
    { href: '#skills', label: '技能' },
    { href: '#projects', label: '作品集' },
    { href: '#contact', label: '聯絡我' }
  ];
</script>

<!-- Navbar -->
<nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a href="/" class="text-xl font-bold text-primary-700 hover:text-primary-500 transition-colors">
        Devin Wu
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        {#each navLinks as link}
          <a
            href={link.href}
            class="text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
            {link.label}
          </a>
        {/each}
      </div>

      <!-- Mobile Hamburger -->
      <button
        onclick={toggleMenu}
        class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {#if mobileMenuOpen}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div class="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
      <div class="px-4 py-3 space-y-2">
        {#each navLinks as link}
          <a
            href={link.href}
            onclick={closeMenu}
            class="block px-3 py-2 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors"
          >
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</nav>

<!-- Main Content -->
<main class="pt-16">
  {@render children()}
</main>

<!-- Footer -->
<footer class="bg-gray-900 text-gray-300">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 class="text-lg font-bold text-white mb-3">Devin Wu</h3>
        <p class="text-sm text-gray-400">打造優質的網頁體驗</p>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">快速連結</h4>
        <ul class="space-y-2">
          {#each navLinks as link}
            <li>
              <a href={link.href} class="text-sm text-gray-400 hover:text-white transition-colors">
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">社群連結</h4>
        <div class="flex gap-4">
          <a href="https://github.com/DevinKWu" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="mailto:devin@example.com" class="text-gray-400 hover:text-white transition-colors" aria-label="Email">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </a>
        </div>
      </div>
    </div>
    <div class="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} Devin Wu. All rights reserved.
    </div>
  </div>
</footer>
