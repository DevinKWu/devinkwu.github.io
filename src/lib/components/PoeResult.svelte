<script>
  let { resultInfo } = $props();
</script>

<div class="w-full rounded-2xl border bg-white shadow-sm {resultInfo.colorClass}">
  <div class="p-7 text-center">
    <div class="result-name text-5xl font-bold tracking-wide leading-none mb-1.5" style="font-family:'Noto Serif TC',serif">
      {resultInfo.name}
    </div>
    <div class="result-subtitle text-sm tracking-wider mb-4" style="font-family:'Noto Serif TC',serif">
      {resultInfo.subtitle}
    </div>
    <p class="text-gray-600 text-sm leading-relaxed mb-3">{resultInfo.message}</p>
    <div class="text-xs tracking-wide text-gray-400">{resultInfo.note}</div>
  </div>
</div>

<style>
  @keyframes result-appear {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes li-card-glow {
    from { box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 0 12px rgba(251,191,36,0.10); }
    to   { box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 0 40px rgba(251,191,36,0.24); }
  }

  :global(.result-li)    { border-color: #fbbf24; animation: result-appear 0.42s ease-out, li-card-glow 1.6s ease-in-out infinite alternate; }
  :global(.result-sheng) { border-color: #6ee7b7; animation: result-appear 0.42s ease-out; }
  :global(.result-yin)   { border-color: #d1d5db; animation: result-appear 0.42s ease-out; }
  :global(.result-xiao)  { border-color: #fcd34d; animation: result-appear 0.42s ease-out; }

  :global(.result-li)    .result-name { color: #ca8a04; }
  :global(.result-sheng) .result-name { color: #059669; }
  :global(.result-yin)   .result-name { color: #6b7280; }
  :global(.result-xiao)  .result-name { color: #d97706; }

  :global(.result-li)    .result-subtitle { color: #d97706; }
  :global(.result-sheng) .result-subtitle { color: #10b981; }
  :global(.result-yin)   .result-subtitle { color: #9ca3af; }
  :global(.result-xiao)  .result-subtitle { color: #f59e0b; }
</style>
