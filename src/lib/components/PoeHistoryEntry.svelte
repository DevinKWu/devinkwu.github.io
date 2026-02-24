<script>
  import { resultMap } from '$lib/data/poe.js';

  let { entry } = $props();

  const isBatch  = $derived(entry.throwCount > 1);
  const firstRes = $derived(entry.streaks[0]?.result ?? 'sheng');
</script>

<li class="history-entry rounded-lg bg-white border border-gray-100 border-l-2 history-entry-{firstRes} shadow-sm overflow-hidden">
  <details class="entry-details">
    <!-- 摘要列（時間 + 次數 + 快速結果） -->
    <summary class="flex items-center gap-2 flex-wrap px-4 py-3 cursor-pointer select-none list-none">
      <span class="text-[0.7rem] text-gray-400 tabular-nums">{entry.time}</span>
      {#if isBatch}
        <span class="text-[0.6rem] text-gray-400 border border-gray-200 rounded-full px-1.5"
              style="font-family:'Noto Serif TC',serif">{entry.throwCount}擲</span>
      {/if}
      <span class="ml-auto flex items-center gap-1.5">
        {#if !isBatch && entry.throws}
          {@const t = entry.throws[0]}
          <span class="entry-result-{t.res} text-xs font-bold" style="font-family:'Noto Serif TC',serif">{resultMap[t.res].name}</span>
        {:else if isBatch}
          <span class="text-[0.65rem] text-gray-400">
            {[
              entry.stats.sheng ? `聖×${entry.stats.sheng}` : '',
              entry.stats.yin   ? `陰×${entry.stats.yin}`   : '',
              entry.stats.xiao  ? `笑×${entry.stats.xiao}`  : '',
              entry.stats.li    ? `立×${entry.stats.li}`    : '',
            ].filter(Boolean).join(' ')}
          </span>
        {/if}
        <span class="entry-chevron text-gray-300 text-[0.55rem]">▸</span>
      </span>
    </summary>

    <!-- 展開內容 -->
    <div class="px-4 pb-3 flex flex-col gap-1.5 border-t border-gray-100 pt-2">
      {#if entry.prayer}
        <details class="prayer-details">
          <summary style="font-family:'Noto Serif TC',serif">祈求內容</summary>
          <p class="prayer-body">{entry.prayer}</p>
        </details>
      {/if}

      {#if !isBatch}
        {@const t = entry.throws[0]}
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1">
            <span class="mini-block {t.b1===0?'mini-yang':t.b1===1?'mini-yin':'mini-li'}">
              {t.b1===0?'陽':t.b1===1?'陰':'立'}
            </span>
            <span class="text-gray-300 text-[0.7rem]">·</span>
            <span class="mini-block {t.b2===0?'mini-yang':t.b2===1?'mini-yin':'mini-li'}">
              {t.b2===0?'陽':t.b2===1?'陰':'立'}
            </span>
          </div>
          <span class="text-gray-300 text-[0.72rem]">→</span>
          <span class="entry-result-{t.res} text-sm font-bold tracking-wide"
                style="font-family:'Noto Serif TC',serif">{resultMap[t.res].name}</span>
        </div>
      {:else}
        {#if entry.throws}
          <div class="flex flex-wrap gap-1">
            {#each entry.throws as t, i}
              <span class="inline-flex items-center gap-0.5 text-[0.65rem] px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100">
                <span class="text-gray-400" style="font-family:'Noto Serif TC',serif">第{i+1}擲</span>
                <span class="entry-result-{t.res} font-bold" style="font-family:'Noto Serif TC',serif">{resultMap[t.res].name}</span>
              </span>
            {/each}
          </div>
        {/if}
        <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-[0.65rem]">
          <span class="text-gray-400 tracking-wider" style="font-family:'Noto Serif TC',serif">統計</span>
          {#if entry.stats.sheng}<span class="entry-result-sheng font-semibold">聖杯×{entry.stats.sheng}</span>{/if}
          {#if entry.stats.yin}<span class="entry-result-yin font-semibold">陰杯×{entry.stats.yin}</span>{/if}
          {#if entry.stats.xiao}<span class="entry-result-xiao font-semibold">笑杯×{entry.stats.xiao}</span>{/if}
          {#if entry.stats.li}<span class="entry-result-li font-semibold">立杯×{entry.stats.li}！</span>{/if}
        </div>
        <div class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.65rem]">
          <span class="text-gray-400 tracking-wider" style="font-family:'Noto Serif TC',serif">連線</span>
          {#each entry.streaks as streak, si}
            <span class="inline-flex items-center gap-0.5">
              <span class="text-gray-400" style="font-family:'Noto Serif TC',serif">第{streak.startIdx}擲</span>
              <span class="entry-result-{streak.result} font-bold" style="font-family:'Noto Serif TC',serif">{resultMap[streak.result].name}</span>
              {#if streak.count > 1}<span class="text-gray-400">連續{streak.count}次</span>{/if}
            </span>
            {#if si < entry.streaks.length - 1}<span class="text-gray-300">›</span>{/if}
          {/each}
        </div>
      {/if}
    </div>
  </details>
</li>

<style>
  .history-entry {
    animation: entry-appear 0.3s ease-out;
  }
  @keyframes entry-appear {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .history-entry-li    { border-left-color: #fbbf24; }
  .history-entry-sheng { border-left-color: #6ee7b7; }
  .history-entry-yin   { border-left-color: #d1d5db; }
  .history-entry-xiao  { border-left-color: #fcd34d; }

  .mini-block {
    font-size: 0.7rem; font-weight: 700;
    padding: 0.1rem 0.35rem; border-radius: 0.25rem;
    letter-spacing: 0.03em; font-family: 'Noto Serif TC', serif;
  }
  .mini-yang { color: #dc2626; background: rgba(220,38,38,0.08); }
  .mini-yin  { color: #b45309; background: rgba(180,83,9,0.08); }
  .mini-li   { color: #ca8a04; background: rgba(202,138,4,0.10); }

  .entry-result-li    { color: #ca8a04; }
  .entry-result-sheng { color: #059669; }
  .entry-result-yin   { color: #6b7280; }
  .entry-result-xiao  { color: #d97706; }

  .entry-details > summary { list-style: none; }
  .entry-details > summary::-webkit-details-marker { display: none; }
  .entry-details > summary:hover { background: #f9fafb; }
  .entry-details[open] > summary .entry-chevron {
    display: inline-block;
    transform: rotate(90deg);
    transition: transform 0.15s ease;
  }
  .entry-chevron { transition: transform 0.15s ease; }

  .prayer-details summary {
    list-style: none;
    cursor: pointer;
    font-size: 0.68rem;
    color: #9ca3af;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    user-select: none;
    letter-spacing: 0.04em;
  }
  .prayer-details summary::-webkit-details-marker { display: none; }
  .prayer-details summary::before {
    content: '▸';
    font-size: 0.55rem;
    transition: transform 0.15s ease;
    display: inline-block;
  }
  .prayer-details[open] summary::before { transform: rotate(90deg); }
  .prayer-details[open] summary { color: #6b7280; }
  .prayer-body {
    margin-top: 0.35rem;
    font-size: 0.76rem;
    color: #374151;
    line-height: 1.6;
    padding-left: 0.75rem;
    border-left: 2px solid #e5e7eb;
    font-style: italic;
    white-space: pre-wrap;
  }
</style>
