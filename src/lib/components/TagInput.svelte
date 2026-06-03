<script>
  // 逗號分隔的標籤輸入框，輸入時跳出已使用過的標籤提示，可點選快速帶入。
  let {
    value = $bindable(''),
    suggestions = [],
    placeholder = '',
    onenter,
    class: className = '',
  } = $props();

  let open = $state(false);
  let inputEl;

  // 把目前輸入拆成「已完成的標籤」與「正在輸入的最後一段」
  const parts = $derived(value.split(/[,，]/));
  const activeSeg = $derived(parts[parts.length - 1].trim());
  const committed = $derived(parts.slice(0, -1).map(s => s.trim()).filter(Boolean));

  // 候選：尚未輸入過、且符合目前輸入片段（不分大小寫）
  const matches = $derived(
    suggestions.filter(t =>
      !committed.includes(t) &&
      t !== activeSeg &&
      (activeSeg === '' || t.toLowerCase().includes(activeSeg.toLowerCase()))
    )
  );

  function pick(tag) {
    value = [...committed, tag].join(', ') + ', ';
    open = true; // 保持開啟，方便繼續挑選
    inputEl?.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Enter') {
      open = false;
      onenter?.(e);
    } else if (e.key === 'Escape') {
      open = false;
    }
  }
</script>

<div class="relative {className}">
  <input
    bind:this={inputEl}
    bind:value
    {placeholder}
    autocomplete="off"
    onfocus={() => (open = true)}
    oninput={() => (open = true)}
    onblur={() => setTimeout(() => (open = false), 120)}
    onkeydown={onKeydown}
    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
  />
  {#if open && matches.length > 0}
    <div class="absolute z-20 left-0 right-0 mt-1 max-h-44 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg py-1">
      {#each matches as tag}
        <button
          type="button"
          onmousedown={(e) => { e.preventDefault(); pick(tag); }}
          class="block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors cursor-pointer"
        >{tag}</button>
      {/each}
    </div>
  {/if}
</div>
