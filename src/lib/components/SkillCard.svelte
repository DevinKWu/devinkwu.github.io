<script>
  let { title, description, color, iconPath, iconPath2 = '', tags } = $props();

  const colorMap = {
    primary: {
      iconBg: 'bg-primary-100',
      iconBgHover: 'group-hover:bg-primary-200',
      iconText: 'text-primary-600',
      tagBg: 'bg-primary-50',
      tagText: 'text-primary-700'
    },
    green: {
      iconBg: 'bg-green-100',
      iconBgHover: 'group-hover:bg-green-200',
      iconText: 'text-green-600',
      tagBg: 'bg-green-50',
      tagText: 'text-green-700'
    },
    purple: {
      iconBg: 'bg-purple-100',
      iconBgHover: 'group-hover:bg-purple-200',
      iconText: 'text-purple-600',
      tagBg: 'bg-purple-50',
      tagText: 'text-purple-700'
    }
  };

  const c = $derived(colorMap[color] || colorMap.primary);
</script>

<div class="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
  <div class="w-12 h-12 {c.iconBg} rounded-xl flex items-center justify-center mb-6 {c.iconBgHover} transition-colors">
    <svg class="w-6 h-6 {c.iconText}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPath} />
      {#if iconPath2}
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPath2} />
      {/if}
    </svg>
  </div>
  <h4 class="text-xl font-bold text-gray-900 mb-3">{title}</h4>
  <p class="text-gray-600 mb-4">{description}</p>
  <div class="flex flex-wrap gap-2">
    {#each tags as tag}
      <span class="inline-flex items-center rounded-full {c.tagBg} px-3 py-1 text-xs font-medium {c.tagText}">
        {tag}
      </span>
    {/each}
  </div>
</div>
