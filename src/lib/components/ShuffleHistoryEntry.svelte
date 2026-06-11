<script>
  import CloseIcon from '$lib/components/icons/CloseIcon.svelte';

  let { entry, ondelete } = $props();
</script>

<li class="history-entry rounded-lg bg-white border border-gray-100 border-l-2 border-l-primary-300 shadow-sm overflow-hidden">
  <details class="entry-details">
    <!-- 摘要列（時間 + 項數 + 刪除） -->
    <summary class="flex items-center gap-2 flex-wrap px-4 py-3 cursor-pointer select-none list-none">
      <span class="text-[0.7rem] text-gray-400 tabular-nums">{entry.time}</span>
      <span class="font-serif text-[0.6rem] text-gray-400 border border-gray-200 rounded-full px-1.5">{entry.count}項</span>
      <span class="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          class="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
          aria-label="刪除此紀錄"
          onclick={(e) => { e.preventDefault(); e.stopPropagation(); ondelete(); }}
        >
          <CloseIcon class="w-3.5 h-3.5" />
        </button>
        <span class="entry-chevron text-gray-300 text-[0.55rem]">▸</span>
      </span>
    </summary>

    <!-- 展開內容：排序結果 -->
    <div class="px-4 pb-3 border-t border-gray-100 pt-2">
      <ol class="flex flex-col gap-1.5">
        {#each entry.result as item, i}
          <li class="flex items-start gap-2 text-sm">
            <span class="shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[0.7rem] font-semibold flex items-center justify-center tabular-nums mt-0.5">{i + 1}</span>
            <span class="flex flex-col gap-0.5">
              <span class="text-gray-800">{item.title}</span>
              {#if item.note}
                <span class="text-xs text-gray-500">{item.note}</span>
              {/if}
              {#if item.tags?.length}
                <span class="flex flex-wrap gap-1 mt-0.5">
                  {#each item.tags as tag}
                    <span class="text-[0.6rem] bg-primary-50 text-primary-700 rounded-full px-1.5 py-0.5">{tag}</span>
                  {/each}
                </span>
              {/if}
            </span>
          </li>
        {/each}
      </ol>
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

  .entry-details > summary { list-style: none; }
  .entry-details > summary::-webkit-details-marker { display: none; }
  .entry-details > summary:hover { background: #f9fafb; }
  .entry-details[open] > summary .entry-chevron {
    display: inline-block;
    transform: rotate(90deg);
    transition: transform 0.15s ease;
  }
  .entry-chevron { transition: transform 0.15s ease; }
</style>
