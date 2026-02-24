<script>
  import { poeColorPresets } from '$lib/data/poe.js';

  let { poeColorId = $bindable(), customHex = $bindable() } = $props();
</script>

<div class="flex items-center justify-center gap-3">
  <span class="text-xs text-gray-400 tracking-wider" style="font-family:'Noto Serif TC',serif">筊杯顏色</span>
  {#each poeColorPresets as preset}
    <button
      class="w-7 h-7 rounded-full border-2 transition-all duration-150 hover:scale-110
             {poeColorId === preset.id ? 'border-gray-600 scale-[1.15] shadow-md' : 'border-transparent'}"
      style="background-color:{preset.swatch}"
      onclick={() => poeColorId = preset.id}
      title={preset.name}
      aria-label="筊杯顏色：{preset.name}"
    ></button>
  {/each}
  <label
    class="relative w-7 h-7 rounded-full border-2 cursor-pointer overflow-hidden transition-all duration-150 hover:scale-110
           {poeColorId === 'custom' ? 'border-gray-600 scale-[1.15] shadow-md' : 'border-gray-300'}"
    title="自訂顏色" aria-label="自訂筊杯顏色">
    <div class="w-full h-full" style="background-color:{customHex}"></div>
    <input type="color"
           class="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
           value={customHex}
           oninput={(e) => { customHex = e.currentTarget.value; poeColorId = 'custom'; }}/>
  </label>
</div>
