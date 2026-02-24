<script>
  import { onMount } from 'svelte';
  import {
    DETAIL_LIMIT, poeColorPresets, resultMap,
    makeColorFromHex, computeStats, computeStreaks,
  } from '$lib/data/poe.js';
  import PoeBlock        from '$lib/components/PoeBlock.svelte';
  import PoeColorPicker  from '$lib/components/PoeColorPicker.svelte';
  import PoeResult       from '$lib/components/PoeResult.svelte';
  import PoeThrowList    from '$lib/components/PoeThrowList.svelte';
  import PoeResultGrid   from '$lib/components/PoeResultGrid.svelte';
  import PoeHistoryEntry from '$lib/components/PoeHistoryEntry.svelte';

  let isAnimating = $state(false);
  let block1 = $state(null); // null = 未擲, 0 = 陽面, 1 = 陰面, 2 = 立
  let block2 = $state(null);
  let prayer = $state('');
  let hasThrown = $state(false);
  let throwCount = $state(1);
  let currentThrows = $state([]); // [{b1, b2, res}, ...]

  // 折疊狀態
  let guideOpen   = $state(false); // 說明區預設收合
  let historyOpen = $state(true);  // 歷史紀錄預設展開

  // 歷史紀錄：{ id, time, prayer, throwCount, stats, streaks, throws? }
  let history = $state([]);
  let historyLoaded = false;

  let customHex  = $state('#C82020');
  let poeColorId = $state('red');

  const poeColor = $derived(
    poeColorId === 'custom'
      ? makeColorFromHex(customHex)
      : (poeColorPresets.find(c => c.id === poeColorId) ?? poeColorPresets[0])
  );

  const resultInfo = $derived(
    currentThrows.length === 1 ? resultMap[currentThrows[0].res] : null
  );

  const throwStats = $derived(
    currentThrows.reduce((acc, t) => {
      acc[t.res] = (acc[t.res] || 0) + 1;
      return acc;
    }, {})
  );

  const streaks = $derived(computeStreaks(currentThrows));

  onMount(() => {
    try {
      const saved = localStorage.getItem('poe-history');
      if (saved) {
        history = JSON.parse(saved);
        // migrate：舊格式 → 新格式 { throwCount, stats, streaks, throws? }
        history = history.map(e => {
          if (e.stats) return e;
          const throws = e.throws ?? [{ b1: e.block1, b2: e.block2, res: e.result }];
          return {
            id: e.id, time: e.time, prayer: e.prayer,
            throwCount: throws.length,
            stats: computeStats(throws),
            streaks: computeStreaks(throws),
            throws: throws.length <= DETAIL_LIMIT ? throws : null,
          };
        });
      }
    } catch {}
    const savedColor = localStorage.getItem('poe-color');
    if (savedColor && (poeColorPresets.some(c => c.id === savedColor) || savedColor === 'custom')) {
      poeColorId = savedColor;
    }
    const savedCustomHex = localStorage.getItem('poe-custom-hex');
    if (savedCustomHex && /^#[0-9a-f]{6}$/i.test(savedCustomHex)) customHex = savedCustomHex;
    historyLoaded = true;
  });

  $effect(() => {
    if (historyLoaded) {
      localStorage.setItem('poe-history', JSON.stringify(history));
      localStorage.setItem('poe-color', poeColorId);
      localStorage.setItem('poe-custom-hex', customHex);
    }
  });

  function clearHistory() {
    history = [];
  }

  function throwPoe() {
    if (isAnimating) return;
    hasThrown = true;
    isAnimating = true;
    block1 = null;
    block2 = null;
    currentThrows = [];

    setTimeout(() => {
      // 每支筊杯有 1/10000 機率直立（立杯）
      const rollBlock = () => Math.floor(Math.random() * 10000) === 0 ? 2 : Math.floor(Math.random() * 2);
      const newThrows = [];
      for (let i = 0; i < throwCount; i++) {
        const b1 = rollBlock(), b2 = rollBlock();
        const res = b1 === 2 || b2 === 2 ? 'li'
                  : b1 !== b2 ? 'sheng'
                  : b1 === 0 ? 'yin' : 'xiao';
        newThrows.push({ b1, b2, res });
      }
      block1 = newThrows[0].b1;
      block2 = newThrows[0].b2;
      currentThrows = newThrows;
      isAnimating = false;

      const now = Date.now();
      const time = new Date().toLocaleString('zh-TW', { hour12: false });
      const stats = computeStats(newThrows);
      const newStreaks = computeStreaks(newThrows);
      history = [
        {
          id: now, time, prayer: prayer.trim(),
          throwCount: newThrows.length,
          stats,
          streaks: newStreaks,
          throws: newThrows.length <= DETAIL_LIMIT ? newThrows : null,
        },
        ...history,
      ].slice(0, 100);
    }, 1100);
  }
</script>

<svelte:head>
  <title>擲杯占卜 | Devin Wu</title>
  <meta name="description" content="傳統台灣廟宇筊杯問卜儀式模擬">
</svelte:head>

<!--
  全域 SVG 漸層定義（document-scoped，所有筊杯 SVG 皆可引用）
-->
<svg width="0" height="0" aria-hidden="true" style="position:absolute;overflow:hidden">
  <defs>
    <radialGradient id="pg-yang" cx="50%" cy="60%" r="55%">
      <stop offset="0%"   stop-color={poeColor.yangD}/>
      <stop offset="50%"  stop-color={poeColor.yangM}/>
      <stop offset="100%" stop-color={poeColor.yangL}/>
    </radialGradient>
    <radialGradient id="pg-spec" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="rgba(255,230,230,0.90)"/>
      <stop offset="40%"  stop-color="rgba(255,200,200,0.45)"/>
      <stop offset="100%" stop-color="rgba(255,200,200,0)"/>
    </radialGradient>
    <radialGradient id="pg-yin" cx="38%" cy="28%" r="65%" fx="35%" fy="24%">
      <stop offset="0%"   stop-color={poeColor.yinB}/>
      <stop offset="25%"  stop-color={poeColor.yinM}/>
      <stop offset="65%"  stop-color={poeColor.yinD}/>
      <stop offset="100%" stop-color={poeColor.yinDk}/>
    </radialGradient>
    <radialGradient id="pg-yin-R" cx="62%" cy="26%" r="65%" fx="60%" fy="22%">
      <stop offset="0%"   stop-color={poeColor.yinB}/>
      <stop offset="25%"  stop-color={poeColor.yinM}/>
      <stop offset="65%"  stop-color={poeColor.yinD}/>
      <stop offset="100%" stop-color={poeColor.yinDk}/>
    </radialGradient>
    <radialGradient id="pg-yin-L" cx="38%" cy="26%" r="65%" fx="40%" fy="22%">
      <stop offset="0%"   stop-color={poeColor.yinB}/>
      <stop offset="25%"  stop-color={poeColor.yinM}/>
      <stop offset="65%"  stop-color={poeColor.yinD}/>
      <stop offset="100%" stop-color={poeColor.yinDk}/>
    </radialGradient>
    <radialGradient id="pg-gold" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="rgba(253,211,77,0.55)"/>
      <stop offset="100%" stop-color="rgba(253,211,77,0)"/>
    </radialGradient>
  </defs>
</svg>

<div class="relative min-h-[calc(100vh-4rem)] bg-gray-50 flex justify-center overflow-hidden">
  <div class="w-full max-w-2xl mx-auto px-6 pt-8 pb-16 flex flex-col items-center gap-9">

    <!-- 標題區 -->
    <header class="w-full flex flex-col items-center gap-4">
      <div class="text-center">
        <div class="flex items-center gap-3 justify-center mb-3">
          <span class="block w-11 h-px bg-gradient-to-r from-transparent to-gray-300"></span>
          <span class="text-gray-400 text-xs">◆</span>
          <span class="block w-11 h-px bg-gradient-to-l from-transparent to-gray-300"></span>
        </div>
        <h1 class="text-5xl font-bold text-gray-900 tracking-wide" style="font-family:'Noto Serif TC',serif">擲杯</h1>
        <p class="text-gray-500 text-sm mt-1.5 tracking-widest" style="font-family:'Noto Serif TC',serif">傳統台灣廟宇問卜儀式</p>
        <div class="flex items-center gap-3 justify-center mt-3">
          <span class="block w-11 h-px bg-gradient-to-r from-transparent to-gray-300"></span>
          <span class="text-gray-400 text-[0.7rem] tracking-widest" style="font-family:'Noto Serif TC',serif">誠心問卜・神明指引</span>
          <span class="block w-11 h-px bg-gradient-to-l from-transparent to-gray-300"></span>
        </div>
      </div>
    </header>

    <!-- 說明區（可折疊） -->
    <PoeResultGrid bind:open={guideOpen} />

    <!-- 祈求欄 -->
    <div class="w-full flex flex-col gap-2">
      <label class="text-center text-gray-500 text-xs tracking-widest" style="font-family:'Noto Serif TC',serif" for="prayer-input">
        心中默念您的祈求（選填）
      </label>
      <textarea
        id="prayer-input"
        bind:value={prayer}
        placeholder="在此輸入您想請示神明的問題..."
        class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors bg-white resize-none text-sm"
        rows="2"
      ></textarea>
    </div>

    <!-- 筊杯顏色選擇 -->
    <PoeColorPicker bind:poeColorId bind:customHex />

    <!-- 筊杯展示區 -->
    <div class="flex items-end gap-10 justify-center py-2">
      <PoeBlock block={block1} {isAnimating} {poeColor} side="left" />
      <div class="text-gray-300 text-base pb-10" aria-hidden="true">✦</div>
      <PoeBlock block={block2} {isAnimating} {poeColor} side="right" delay={true} />
    </div>

    <!-- 擲杯次數 -->
    <div class="flex items-center gap-2">
      <label class="text-xs text-gray-400 tracking-wider" style="font-family:'Noto Serif TC',serif"
             for="throw-count">一次擲</label>
      <input
        id="throw-count"
        type="number"
        min="1" max="10000"
        bind:value={throwCount}
        class="w-14 rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm text-gray-700
               focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none
               transition-colors bg-white"
      />
      <span class="text-xs text-gray-400 tracking-wider" style="font-family:'Noto Serif TC',serif">次</span>
    </div>

    <!-- 擲杯按鈕 -->
    <button
      class="throw-btn relative overflow-hidden rounded-full px-14 py-3.5 text-lg font-bold tracking-widest text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-65 disabled:cursor-default transition-all duration-200 shadow-lg shadow-primary-500/30 flex items-center gap-2"
      style="font-family:'Noto Serif TC',serif"
      onclick={throwPoe}
      disabled={isAnimating}
    >
      {#if isAnimating}
        <span class="btn-spinner"></span>
        擲中...
      {:else if hasThrown}
        再擲一次
      {:else}
        擲杯
      {/if}
    </button>

    <!-- 結果顯示 -->
    {#if currentThrows.length > 0 && !isAnimating}
      {#if throwCount === 1}
        <PoeResult {resultInfo} />
      {:else}
        <PoeThrowList throws={currentThrows} {throwStats} {streaks} />
      {/if}
    {:else if !hasThrown}
      <p class="text-gray-400 text-sm tracking-widest" style="font-family:'Noto Serif TC',serif">誠心默念，點擊擲杯</p>
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
            擲杯紀錄{#if history.length > 0}<span class="text-gray-300 font-normal">（{history.length}）</span>{/if}
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
          <p class="text-center text-gray-400 text-sm py-6 tracking-wider" style="font-family:'Noto Serif TC',serif">尚無擲杯紀錄</p>
        {:else}
          <ul class="space-y-2">
            {#each history as entry (entry.id)}
              <PoeHistoryEntry {entry} />
            {/each}
          </ul>
        {/if}
      {/if}
    </div>

  </div>
</div>

<style>
  .throw-btn::before {
    content: ''; position: absolute; top: 0; left: -70%;
    width: 45%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transform: skewX(-20deg); transition: left 0.55s ease; pointer-events: none;
  }
  .throw-btn:hover:not(:disabled)::before { left: 160%; }
  .throw-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .throw-btn:active:not(:disabled) { transform: translateY(0); }

  .btn-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4); border-top-color: white;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
