<script>
  import { onMount } from 'svelte';
  import { HISTORY_LIMIT, makeId, shuffle, parseTags, formatTime } from '$lib/data/shuffle.js';
  import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
  import ShuffleHistoryEntry from '$lib/components/ShuffleHistoryEntry.svelte';

  // 選項：{ id, title, note, tags, createdAt, updatedAt }
  let options = $state([]);
  let newTitle = $state('');
  let newNote = $state('');
  let newTagsStr = $state('');

  let editingId = $state(null);
  let editTitle = $state('');
  let editNote = $state('');
  let editTagsStr = $state('');

  let activeFilters = $state([]); // 已選取的篩選標籤（空 = 顯示全部）

  let currentResult = $state([]); // 上次排序結果（{title, note, tags}[]）
  let hasShuffled = $state(false);

  // 歷史：{ id, time, result: {title, note, tags}[], count }
  let history = $state([]);
  let historyOpen = $state(true);

  let addFormOpen = $state(true); // 新增表單摺疊
  let listOpen = $state(true);    // 選項清單摺疊

  let dataLoaded = false; // 非反應式守衛

  // 所有出現過的標籤（去重）
  const allTags = $derived([...new Set(options.flatMap(o => o.tags))]);
  // 篩選函式：空 activeFilters = 全部；否則需含全部已選標籤（AND）
  const matchFilter = (o) => activeFilters.length === 0 || activeFilters.every(t => o.tags.includes(t));
  // 清單顯示用（僅顯示過濾，不影響排序）
  const filteredOptions = $derived(options.filter(matchFilter));
  // 排序對象 = 完整清單中標題非空者（不受篩選影響）
  const validOptions = $derived(options.filter(o => o.title.trim() !== ''));
  const canStart = $derived(validOptions.length >= 2);
  // 結果顯示：對已排序的完整結果做標籤過濾（保留排序順序）
  const filteredResult = $derived(currentResult.filter(matchFilter));

  onMount(() => {
    try {
      const savedOptions = localStorage.getItem('shuffle-options');
      if (savedOptions) {
        const parsed = JSON.parse(savedOptions);
        if (Array.isArray(parsed)) options = parsed;
      }
    } catch {}
    try {
      const savedHistory = localStorage.getItem('shuffle-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) history = parsed;
      }
    } catch {}
    dataLoaded = true;
  });

  $effect(() => {
    if (dataLoaded) {
      localStorage.setItem('shuffle-options', JSON.stringify(options));
      localStorage.setItem('shuffle-history', JSON.stringify(history));
    }
  });

  // 刪除/編輯後清掉已不存在的篩選標籤
  function pruneFilters() {
    const tags = new Set(options.flatMap(o => o.tags));
    activeFilters = activeFilters.filter(t => tags.has(t));
  }

  function addOption() {
    if (newTitle.trim() === '') return;
    const now = Date.now();
    options = [
      ...options,
      {
        id: makeId(),
        title: newTitle.trim(),
        note: newNote.trim(),
        tags: parseTags(newTagsStr),
        createdAt: now,
        updatedAt: now,
      },
    ];
    newTitle = '';
    newNote = '';
    newTagsStr = '';
  }

  function startEdit(o) {
    editingId = o.id;
    editTitle = o.title;
    editNote = o.note;
    editTagsStr = o.tags.join(', ');
  }

  function commitEdit() {
    const id = editingId;
    if (editTitle.trim() === '') {
      // 標題清空 = 刪除
      options = options.filter(o => o.id !== id);
    } else {
      const tags = parseTags(editTagsStr);
      options = options.map(o =>
        o.id === id
          ? { ...o, title: editTitle.trim(), note: editNote.trim(), tags, updatedAt: Date.now() }
          : o
      );
    }
    editingId = null;
    pruneFilters();
  }

  function cancelEdit() {
    editingId = null;
  }

  function deleteOption(id) {
    options = options.filter(o => o.id !== id);
    if (editingId === id) editingId = null;
    pruneFilters();
  }

  function toggleFilter(tag) {
    activeFilters = activeFilters.includes(tag)
      ? activeFilters.filter(t => t !== tag)
      : [...activeFilters, tag];
  }

  function clearFilters() {
    activeFilters = [];
  }

  function start() {
    if (!canStart) return;
    const items = validOptions.map(o => ({ title: o.title.trim(), note: o.note.trim(), tags: o.tags }));
    currentResult = shuffle(items);
    hasShuffled = true;
    history = [
      { id: Date.now(), time: formatTime(Date.now()), result: currentResult, count: currentResult.length },
      ...history,
    ].slice(0, HISTORY_LIMIT);
  }

  function deleteEntry(id) {
    history = history.filter(e => e.id !== id);
  }

  function clearHistory() {
    history = [];
  }
</script>

<svelte:head>
  <title>隨機排序 | Devin Wu</title>
  <meta name="description" content="輸入多個選項，一鍵隨機排序，並保存歷史紀錄">
</svelte:head>

<div class="relative min-h-[calc(100vh-4rem)] bg-gray-50 flex justify-center overflow-hidden">
  <div class="w-full max-w-2xl mx-auto px-6 pt-8 pb-16 flex flex-col gap-9">

    <!-- 標題區 -->
    <header class="w-full flex flex-col items-center gap-4">
      <div class="text-center">
        <div class="flex items-center gap-3 justify-center mb-3">
          <span class="block w-11 h-px bg-gradient-to-r from-transparent to-gray-300"></span>
          <span class="text-gray-400 text-xs">◆</span>
          <span class="block w-11 h-px bg-gradient-to-l from-transparent to-gray-300"></span>
        </div>
        <h1 class="text-5xl font-bold text-gray-900 tracking-wide" style="font-family:'Noto Serif TC',serif">隨機排序</h1>
        <p class="text-gray-500 text-sm mt-1.5 tracking-widest" style="font-family:'Noto Serif TC',serif">輸入選項，隨機排出順序</p>
        <div class="flex items-center gap-3 justify-center mt-3">
          <span class="block w-11 h-px bg-gradient-to-r from-transparent to-gray-300"></span>
          <span class="text-gray-400 text-[0.7rem] tracking-widest" style="font-family:'Noto Serif TC',serif">自動保存・歷史紀錄</span>
          <span class="block w-11 h-px bg-gradient-to-l from-transparent to-gray-300"></span>
        </div>
      </div>
    </header>

    <!-- 選項編輯區 -->
    <section class="w-full flex flex-col gap-4">
      <!-- 新增表單（可摺疊） -->
      <button
        class="flex items-center gap-2 cursor-pointer"
        onclick={() => addFormOpen = !addFormOpen}
        aria-expanded={addFormOpen}
      >
        <h2 class="text-gray-500 text-xs tracking-widest uppercase" style="font-family:'Noto Serif TC',serif">新增選項</h2>
        <span class="text-gray-400 text-[0.6rem] transition-transform duration-200 {addFormOpen ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
      </button>

      {#if addFormOpen}
      <!-- 新增區 -->
      <div class="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
        <input
          bind:value={newTitle}
          onkeydown={(e) => { if (e.key === 'Enter') addOption(); }}
          placeholder="選項標題"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
        />
        <input
          bind:value={newNote}
          onkeydown={(e) => { if (e.key === 'Enter') addOption(); }}
          placeholder="備註（選填）"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
        />
        <div class="flex gap-2">
          <input
            bind:value={newTagsStr}
            onkeydown={(e) => { if (e.key === 'Enter') addOption(); }}
            placeholder="標籤，以逗號分隔（選填）"
            class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
          />
          <button
            type="button"
            onclick={addOption}
            class="shrink-0 bg-primary-600 hover:bg-primary-700 text-white rounded-full px-5 py-2 text-sm font-medium transition-colors cursor-pointer"
          >新增</button>
        </div>
      </div>
      {/if}

      <!-- 選項清單（可摺疊） -->
      <button
        class="flex items-center gap-2 cursor-pointer"
        onclick={() => listOpen = !listOpen}
        aria-expanded={listOpen}
      >
        <h2 class="text-gray-500 text-xs tracking-widest uppercase" style="font-family:'Noto Serif TC',serif">選項清單{#if options.length > 0}<span class="text-gray-300 normal-case">（{options.length}）</span>{/if}</h2>
        <span class="text-gray-400 text-[0.6rem] transition-transform duration-200 {listOpen ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
      </button>

      {#if listOpen}
      {#if options.length === 0}
        <p class="text-center text-gray-400 text-sm py-6 tracking-wider" style="font-family:'Noto Serif TC',serif">尚無選項，請新增</p>
      {:else if filteredOptions.length === 0}
        <p class="text-center text-gray-400 text-sm py-6 tracking-wider" style="font-family:'Noto Serif TC',serif">沒有符合篩選的選項</p>
      {:else}
        <ul class="flex flex-col gap-2">
          {#each filteredOptions as option (option.id)}
            <li class="rounded-lg bg-white border border-gray-100 shadow-sm px-4 py-3">
              {#if editingId === option.id}
                <!-- 編輯模式 -->
                <div class="flex flex-col gap-2">
                  <input
                    bind:value={editTitle}
                    placeholder="選項標題"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
                  />
                  <input
                    bind:value={editNote}
                    placeholder="備註（選填）"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
                  />
                  <input
                    bind:value={editTagsStr}
                    placeholder="標籤，以逗號分隔（選填）"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
                  />
                  <div class="flex gap-2">
                    <button type="button" onclick={commitEdit} class="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer">儲存</button>
                    <button type="button" onclick={cancelEdit} class="border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 rounded-full px-4 py-1.5 text-xs transition-colors cursor-pointer">取消</button>
                  </div>
                </div>
              {:else}
                <!-- 一般模式 -->
                <div class="flex items-start gap-3">
                  <div class="flex-1 flex flex-col gap-1 min-w-0">
                    <span class="font-medium text-gray-800 break-words">{option.title}</span>
                    {#if option.note}
                      <span class="text-sm text-gray-500 break-words">{option.note}</span>
                    {/if}
                    {#if option.tags.length > 0}
                      <span class="flex flex-wrap gap-1">
                        {#each option.tags as tag}
                          <span class="text-[0.65rem] bg-primary-50 text-primary-700 rounded-full px-2 py-0.5">{tag}</span>
                        {/each}
                      </span>
                    {/if}
                    <span class="text-[0.65rem] text-gray-400 tabular-nums">
                      新增 {formatTime(option.createdAt)}{#if option.updatedAt !== option.createdAt}・變更 {formatTime(option.updatedAt)}{/if}
                    </span>
                  </div>
                  <div class="shrink-0 flex items-center gap-2">
                    <button type="button" onclick={() => startEdit(option)} class="text-xs text-gray-400 hover:text-primary-600 transition-colors cursor-pointer">編輯</button>
                    <button type="button" onclick={() => deleteOption(option.id)} aria-label="刪除選項" class="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                      <CloseIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
      {/if}
    </section>

    <!-- 標籤篩選列 -->
    {#if allTags.length > 0}
      <div class="flex flex-wrap items-center justify-center gap-2">
        <span class="text-xs text-gray-400 tracking-wider" style="font-family:'Noto Serif TC',serif">篩選標籤</span>
        {#each allTags as tag}
          <button
            type="button"
            onclick={() => toggleFilter(tag)}
            class="text-xs rounded-full px-2.5 py-0.5 transition-colors cursor-pointer {activeFilters.includes(tag) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
          >{tag}</button>
        {/each}
        {#if activeFilters.length > 0}
          <button
            type="button"
            onclick={clearFilters}
            class="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >清除篩選</button>
        {/if}
      </div>
    {/if}

    <!-- 開始按鈕 -->
    <div class="flex flex-col items-center gap-2">
      <button
        class="shuffle-btn relative overflow-hidden rounded-full px-14 py-3.5 text-lg font-bold tracking-widest text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-65 disabled:cursor-default transition-all duration-200 shadow-lg shadow-primary-500/30"
        style="font-family:'Noto Serif TC',serif"
        onclick={start}
        disabled={!canStart}
      >開始</button>
      {#if !canStart}
        <p class="text-xs text-gray-400 tracking-wider" style="font-family:'Noto Serif TC',serif">至少需要兩個選項</p>
      {/if}
    </div>

    <!-- 排序結果 -->
    {#if currentResult.length > 0}
      <section class="w-full rounded-xl border border-gray-200 bg-white p-5">
        <h2 class="text-gray-500 text-xs tracking-widest uppercase mb-3" style="font-family:'Noto Serif TC',serif">
          排序結果{#if activeFilters.length > 0}<span class="text-gray-300 normal-case tracking-normal">（已篩選）</span>{/if}
        </h2>
        {#if filteredResult.length === 0}
          <p class="text-center text-gray-400 text-sm py-4 tracking-wider" style="font-family:'Noto Serif TC',serif">沒有符合篩選的結果</p>
        {:else}
          <ol class="flex flex-col gap-2">
            {#each filteredResult as item, i}
              <li class="flex items-start gap-3">
                <span class="shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center tabular-nums mt-0.5">{i + 1}</span>
                <span class="flex flex-col gap-0.5 min-w-0">
                  <span class="text-gray-800 break-words">{item.title}</span>
                  {#if item.note}
                    <span class="text-sm text-gray-500 break-words">{item.note}</span>
                  {/if}
                  {#if item.tags?.length}
                    <span class="flex flex-wrap gap-1 mt-0.5">
                      {#each item.tags as tag}
                        <span class="text-[0.65rem] bg-primary-50 text-primary-700 rounded-full px-2 py-0.5">{tag}</span>
                      {/each}
                    </span>
                  {/if}
                </span>
              </li>
            {/each}
          </ol>
        {/if}
      </section>
    {:else if !hasShuffled}
      <p class="text-center text-gray-400 text-sm tracking-widest" style="font-family:'Noto Serif TC',serif">新增選項後，點擊開始</p>
    {/if}

    <!-- 歷史紀錄 -->
    <div class="w-full pt-8 border-t border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <button
          class="flex items-center gap-2 cursor-pointer"
          onclick={() => historyOpen = !historyOpen}
          aria-expanded={historyOpen}
        >
          <h2 class="flex items-center gap-3 text-gray-400 text-xs tracking-widest uppercase" style="font-family:'Noto Serif TC',serif">
            <span class="block w-11 h-px bg-gradient-to-r from-transparent to-gray-300"></span>
            歷史紀錄{#if history.length > 0}<span class="text-gray-300 font-normal">（{history.length}）</span>{/if}
            <span class="block w-11 h-px bg-gradient-to-l from-transparent to-gray-300"></span>
          </h2>
          <span class="text-gray-400 text-[0.6rem] transition-transform duration-200 {historyOpen ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
        </button>
        {#if history.length > 0}
          <button
            class="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-0.5 hover:text-gray-600 hover:border-gray-300 transition-colors bg-transparent cursor-pointer"
            onclick={clearHistory}
          >清除紀錄</button>
        {/if}
      </div>

      {#if historyOpen}
        {#if history.length === 0}
          <p class="text-center text-gray-400 text-sm py-6 tracking-wider" style="font-family:'Noto Serif TC',serif">尚無歷史紀錄</p>
        {:else}
          <ul class="space-y-2">
            {#each history as entry (entry.id)}
              <ShuffleHistoryEntry {entry} ondelete={() => deleteEntry(entry.id)} />
            {/each}
          </ul>
        {/if}
      {/if}
    </div>

  </div>
</div>

<style>
  .shuffle-btn::before {
    content: ''; position: absolute; top: 0; left: -70%;
    width: 45%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transform: skewX(-20deg); transition: left 0.55s ease; pointer-events: none;
  }
  .shuffle-btn:hover:not(:disabled)::before { left: 160%; }
  .shuffle-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .shuffle-btn:active:not(:disabled) { transform: translateY(0); }
</style>
