<script>
  import { DETAIL_LIMIT, resultMap } from '$lib/data/poe.js';

  let { throws, throwStats, streaks } = $props();
</script>

<div class="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
  {#if throws.length <= DETAIL_LIMIT}
    <ul class="divide-y divide-gray-100">
      {#each throws as t, i}
        <li class="flex items-center gap-3 px-4 py-2.5">
          <span class="text-[0.7rem] text-gray-400 w-10 shrink-0"
                style="font-family:'Noto Serif TC',serif">第{i+1}擲</span>
          <span class="mini-block {t.b1===0?'mini-yang':t.b1===1?'mini-yin':'mini-li'}">
            {t.b1===0?'陽':t.b1===1?'陰':'立'}
          </span>
          <span class="text-gray-300 text-[0.7rem]">·</span>
          <span class="mini-block {t.b2===0?'mini-yang':t.b2===1?'mini-yin':'mini-li'}">
            {t.b2===0?'陽':t.b2===1?'陰':'立'}
          </span>
          <span class="text-gray-300 text-[0.72rem]">→</span>
          <span class="text-sm font-bold tracking-wide entry-result-{t.res}"
                style="font-family:'Noto Serif TC',serif">{resultMap[t.res].name}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="px-4 py-3 text-[0.72rem] text-gray-400 border-b border-gray-100"
         style="font-family:'Noto Serif TC',serif">
      共 {throws.length} 擲，顯示統計與連線摘要
    </div>
  {/if}

  <div class="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
    <span class="text-[0.7rem] text-gray-400 tracking-wider mr-1"
          style="font-family:'Noto Serif TC',serif">統計</span>
    {#if throwStats.sheng}
      <span class="text-[0.72rem] entry-result-sheng font-semibold">聖杯 ×{throwStats.sheng}</span>
    {/if}
    {#if throwStats.yin}
      <span class="text-[0.72rem] entry-result-yin font-semibold">陰杯 ×{throwStats.yin}</span>
    {/if}
    {#if throwStats.xiao}
      <span class="text-[0.72rem] entry-result-xiao font-semibold">笑杯 ×{throwStats.xiao}</span>
    {/if}
    {#if throwStats.li}
      <span class="text-[0.72rem] entry-result-li font-semibold">立杯 ×{throwStats.li}！</span>
    {/if}
  </div>

  <div class="px-4 py-2.5 border-t border-gray-100">
    <div class="text-[0.7rem] text-gray-400 tracking-widest mb-1.5"
         style="font-family:'Noto Serif TC',serif">連線紀錄</div>
    <div class="flex flex-col gap-0.5">
      {#each streaks as streak}
        <div class="flex items-center gap-2 text-xs">
          <span class="text-gray-400 tabular-nums shrink-0 w-[4rem]"
                style="font-family:'Noto Serif TC',serif">第{streak.startIdx}擲</span>
          <span class="entry-result-{streak.result} font-bold tracking-wide"
                style="font-family:'Noto Serif TC',serif">{resultMap[streak.result].name}</span>
          {#if streak.count > 1}
            <span class="text-gray-400 text-[0.65rem]">連續 {streak.count} 次</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
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
</style>
