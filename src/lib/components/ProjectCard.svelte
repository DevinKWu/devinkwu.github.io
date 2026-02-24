<script>
  import GitHubIcon from './icons/GitHubIcon.svelte';
  import FolderIcon from './icons/FolderIcon.svelte';
  import ArrowRightIcon from './icons/ArrowRightIcon.svelte';

  let { title, description, tags, color } = $props();

  const gradientMap = {
    primary: 'from-primary-400 to-primary-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600'
  };

  const gradient = $derived(gradientMap[color] || gradientMap.primary);
</script>

<div class="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-xl transition-all duration-300">
  <div class="h-48 bg-gradient-to-br {gradient} flex items-center justify-center">
    <FolderIcon class="w-16 h-16 text-white/80" />
  </div>

  <div class="p-6">
    <h4 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
      {title}
    </h4>
    <p class="mt-2 text-sm text-gray-600 leading-relaxed">
      {description}
    </p>
    <div class="mt-4 flex flex-wrap gap-2">
      {#each tags as tag}
        <span class="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {tag}
        </span>
      {/each}
    </div>
    <div class="mt-5 flex items-center gap-4">
      <span class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors cursor-pointer">
        查看專案
        <ArrowRightIcon class="ml-1 w-4 h-4" />
      </span>
      <span class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
        <GitHubIcon class="w-4 h-4 mr-1" />
        原始碼
      </span>
    </div>
  </div>
</div>
