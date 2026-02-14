<script>
  let { subtitle, title, description = '' } = $props();
</script>

<div class="text-center mb-16">
  <h2 class="text-sm font-semibold text-primary-600 uppercase tracking-wider">{subtitle}</h2>
  <h3 class="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">{title}</h3>
  {#if description}
    <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
  {/if}
</div>
