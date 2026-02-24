<script>
  let { open = $bindable(false) } = $props();
</script>

<div class="w-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
  <button
    class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
    onclick={() => open = !open}
    aria-expanded={open}
  >
    <h2 class="flex items-center gap-3 text-gray-400 text-xs tracking-widest uppercase" style="font-family:'Noto Serif TC',serif">
      <span class="block w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></span>
      擲杯說明
      <span class="block w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></span>
    </h2>
    <span class="text-gray-400 text-[0.6rem] transition-transform duration-200 {open ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
  </button>
  {#if open}
    <div class="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
      <div class="grid grid-cols-3 gap-3 pt-3">
        <div class="text-center p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:-translate-y-0.5 transition-transform">
          <div class="text-emerald-600 text-xl font-bold mb-1" style="font-family:'Noto Serif TC',serif">聖</div>
          <div class="text-emerald-600 font-bold text-sm" style="font-family:'Noto Serif TC',serif">聖杯</div>
          <div class="text-gray-500 text-xs mt-1">一陽一陰</div>
          <div class="text-gray-500 text-xs">神明允許</div>
        </div>
        <div class="text-center p-4 rounded-xl border border-gray-200 bg-gray-50 hover:-translate-y-0.5 transition-transform">
          <div class="text-gray-600 text-xl font-bold mb-1" style="font-family:'Noto Serif TC',serif">陰</div>
          <div class="text-gray-600 font-bold text-sm" style="font-family:'Noto Serif TC',serif">陰杯</div>
          <div class="text-gray-500 text-xs mt-1">兩個平面</div>
          <div class="text-gray-500 text-xs">神明不允</div>
        </div>
        <div class="text-center p-4 rounded-xl border border-amber-200 bg-amber-50 hover:-translate-y-0.5 transition-transform">
          <div class="text-amber-600 text-xl font-bold mb-1" style="font-family:'Noto Serif TC',serif">笑</div>
          <div class="text-amber-600 font-bold text-sm" style="font-family:'Noto Serif TC',serif">笑杯</div>
          <div class="text-gray-500 text-xs mt-1">兩個弧面</div>
          <div class="text-gray-500 text-xs">再擲一次</div>
        </div>
      </div>
      <div class="flex items-center gap-4 p-3 rounded-xl border border-yellow-200 bg-yellow-50 hover:-translate-y-0.5 transition-transform">
        <div class="text-yellow-600 text-2xl font-bold min-w-8 text-center" style="font-family:'Noto Serif TC',serif">立</div>
        <div>
          <div class="text-yellow-600 font-bold text-sm" style="font-family:'Noto Serif TC',serif">立杯</div>
          <div class="text-gray-500 text-xs mt-0.5">筊杯直立不倒，萬分之一</div>
          <div class="text-gray-500 text-xs">神蹟顯現，極為罕見</div>
        </div>
      </div>
    </div>
  {/if}
</div>
