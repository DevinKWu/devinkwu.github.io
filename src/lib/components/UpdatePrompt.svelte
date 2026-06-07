<script>
  import { onMount } from 'svelte';

  let visible = $state(false);
  let updateSW = $state(null);

  onMount(async () => {
    const { registerSW } = await import('virtual:pwa-register');
    updateSW = registerSW({
      onNeedRefresh() {
        visible = true;
      }
    });
  });

  function applyUpdate() {
    updateSW?.(true);
  }

  function dismiss() {
    visible = false;
  }
</script>

{#if visible}
  <div
    role="alert"
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 text-sm whitespace-nowrap"
  >
    <span class="text-gray-700 font-medium">網站有新版本可用</span>
    <button
      onclick={applyUpdate}
      class="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-xs"
    >
      立即更新
    </button>
    <button
      onclick={dismiss}
      class="px-3 py-1.5 text-gray-400 hover:text-gray-600 transition-colors text-xs"
    >
      稍後
    </button>
  </div>
{/if}
