<script>
  import '../app.css';
  import { siteConfig, navLinks } from '$lib/data/site.js';
  import GitHubIcon from '$lib/components/icons/GitHubIcon.svelte';
  import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
  import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
  import MenuIcon from '$lib/components/icons/MenuIcon.svelte';
  import ChevronDownIcon from '$lib/components/icons/ChevronDownIcon.svelte';
  import ChevronUpIcon from '$lib/components/icons/ChevronUpIcon.svelte';

  let { children } = $props();
  let mobileMenuOpen = $state(false);
  let showScrollTop = $state(false);
  let showScrollBottom = $state(false);

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMenu() {
    mobileMenuOpen = false;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  }

  $effect(() => {
    function onScroll() {
      showScrollTop = window.scrollY > 300;
      showScrollBottom = window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 300;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<!-- Navbar -->
<nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a href="/" class="text-xl font-bold text-primary-700 hover:text-primary-500 transition-colors">
        {siteConfig.name}
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
          <CloseIcon />
        {:else}
          <MenuIcon />
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
        <h3 class="text-lg font-bold text-white mb-3">{siteConfig.name}</h3>
        <p class="text-sm text-gray-400">{siteConfig.tagline}</p>
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
          <a href={siteConfig.github.url} target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a href="mailto:{siteConfig.email}" class="text-gray-400 hover:text-white transition-colors" aria-label="Email">
            <EmailIcon />
          </a>
        </div>
      </div>
    </div>
    <div class="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
    </div>
  </div>
</footer>

<!-- Scroll to Bottom Button -->
{#if showScrollBottom}
  <button
    onclick={scrollToBottom}
    class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary-600 text-white shadow-lg shadow-primary-500/40 hover:bg-primary-700 hover:shadow-primary-500/60 hover:translate-y-0.5 transition-all duration-200 flex items-center justify-center"
    aria-label="前往頁尾"
  >
    <ChevronDownIcon class="w-5 h-5" />
  </button>
{/if}

<!-- Scroll to Top Button -->
{#if showScrollTop}
  <button
    onclick={scrollToTop}
    class="fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full bg-primary-600 text-white shadow-lg shadow-primary-500/40 hover:bg-primary-700 hover:shadow-primary-500/60 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
    aria-label="回到頂部"
  >
    <ChevronUpIcon class="w-5 h-5" />
  </button>
{/if}
