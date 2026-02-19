<script>
  import { onMount } from 'svelte';

  let isAnimating = $state(false);
  let block1 = $state(null); // null = 未擲, 0 = 陽面, 1 = 陰面, 2 = 立
  let block2 = $state(null);
  let prayer = $state('');
  let hasThrown = $state(false);
  let throwCount = $state(1);
  let currentThrows = $state([]); // [{b1, b2, res}, ...]

  // N 超過此值時不渲染逐筆清單（避免大量 DOM 節點卡頓）
  const DETAIL_LIMIT = 50;

  // 折疊狀態
  let guideOpen   = $state(false); // 說明區預設收合
  let historyOpen = $state(true);  // 歷史紀錄預設展開

  // 歷史紀錄：{ id, time, prayer, throwCount, stats, streaks, throws? }
  let history = $state([]);
  let historyLoaded = false;

  // 筊杯顏色預設（三個固定 + 一個自訂）
  const poeColorPresets = [
    { id: 'red',       name: '正紅', swatch: '#C82020',
      yangL: '#D03030', yangM: '#A81818', yangD: '#800E0E',
      yinB:  '#FF5555', yinM:  '#E02424', yinD:  '#A81010', yinDk: '#780808',
      rim: '#550606' },
    { id: 'vermilion', name: '朱砂', swatch: '#D43810',
      yangL: '#E05020', yangM: '#B83010', yangD: '#902010',
      yinB:  '#FF6535', yinM:  '#E04020', yinD:  '#B82C10', yinDk: '#881808',
      rim: '#601008' },
    { id: 'burgundy',  name: '深棗', swatch: '#7A1818',
      yangL: '#9C2020', yangM: '#741414', yangD: '#520E0E',
      yinB:  '#BE2424', yinM:  '#941818', yinD:  '#6C1010', yinDk: '#440808',
      rim: '#3C0606' },
  ];

  let customHex = $state('#C82020');
  let poeColorId = $state('red');

  // HSL 色彩轉換（無須外部 lib）
  function hexToHsl(hex) {
    const r = parseInt(hex.slice(1,3),16)/255;
    const g = parseInt(hex.slice(3,5),16)/255;
    const b = parseInt(hex.slice(5,7),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h = 0, s = 0, l = (max+min)/2;
    if (max !== min) {
      const d = max-min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max) {
        case r: h = ((g-b)/d + (g<b?6:0))/6; break;
        case g: h = ((b-r)/d + 2)/6; break;
        case b: h = ((r-g)/d + 4)/6; break;
      }
    }
    return [h*360, s*100, l*100];
  }

  function hslToHex(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    const q = l < 0.5 ? l*(1+s) : l+s-l*s;
    const p = 2*l-q;
    const hue2rgb = (t) => {
      if (t<0) t+=1; if (t>1) t-=1;
      if (t<1/6) return p+(q-p)*6*t;
      if (t<1/2) return q;
      if (t<2/3) return p+(q-p)*(2/3-t)*6;
      return p;
    };
    const [r,g,b] = s === 0
      ? [l,l,l]
      : [hue2rgb(h+1/3), hue2rgb(h), hue2rgb(h-1/3)];
    return '#' + [r,g,b].map(x => Math.round(x*255).toString(16).padStart(2,'0')).join('');
  }

  function makeColorFromHex(hex) {
    const [h, s, l] = hexToHsl(hex);
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    return {
      id: 'custom', name: '自訂', swatch: hex,
      yangD: hslToHex(h, clamp(s*1.1,0,100), clamp(l*0.55,5,80)),
      yangM: hslToHex(h, clamp(s*1.05,0,100), clamp(l*0.70,5,80)),
      yangL: hslToHex(h, s, clamp(l*1.15,5,85)),
      yinB:  hslToHex(h, clamp(s*0.9,10,100), clamp(l*1.40,10,90)),
      yinM:  hslToHex(h, s, clamp(l*1.05,10,82)),
      yinD:  hslToHex(h, clamp(s*1.05,0,100), clamp(l*0.78,5,80)),
      yinDk: hslToHex(h, clamp(s*1.1,0,100), clamp(l*0.52,3,70)),
      rim:   hslToHex(h, clamp(s*1.1,0,100), clamp(l*0.32,3,50)),
    };
  }

  const poeColor = $derived(
    poeColorId === 'custom'
      ? makeColorFromHex(customHex)
      : (poeColorPresets.find(c => c.id === poeColorId) ?? poeColorPresets[0])
  );

  onMount(() => {
    try {
      const saved = localStorage.getItem('poe-history');
      if (saved) {
        history = JSON.parse(saved);
        // migrate：舊格式 → 新格式 { throwCount, stats, streaks, throws? }
        history = history.map(e => {
          if (e.stats) return e; // 已是新格式
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


  const resultMap = {
    li: {
      name: '立杯',
      subtitle: '神蹟顯現',
      message: '萬中無一的神蹟！筊杯直立而不倒，此乃神明強烈降臨之徵兆，所求之事意義非凡，必得虔誠感恩並認真對待此天啟。',
      note: '筊杯直立，萬分之一的奇蹟',
      colorClass: 'result-li',
    },
    sheng: {
      name: '聖杯',
      subtitle: '神明允許',
      message: '神明點頭，您的心願已獲允許。此事將會順利，可安心前行。',
      note: '一陽一陰，相輔相成',
      colorClass: 'result-sheng',
    },
    yin: {
      name: '陰杯',
      subtitle: '神明不允',
      message: '神明搖頭，此事暫不適宜。請再三思量，或靜待更好的時機。',
      note: '兩個平面朝上',
      colorClass: 'result-yin',
    },
    xiao: {
      name: '笑杯',
      subtitle: '神明在笑',
      message: '神明展顏微笑，問題尚不明確。請誠心整理思緒，再擲一次。',
      note: '兩個弧面朝上',
      colorClass: 'result-xiao',
    },
  };

  const resultInfo = $derived(
    currentThrows.length === 1 ? resultMap[currentThrows[0].res] : null
  );

  const throwStats = $derived(
    currentThrows.reduce((acc, t) => {
      acc[t.res] = (acc[t.res] || 0) + 1;
      return acc;
    }, {})
  );

  function computeStats(throws) {
    return throws.reduce((acc, t) => {
      acc[t.res] = (acc[t.res] || 0) + 1;
      return acc;
    }, {});
  }

  function computeStreaks(throws) {
    const segs = [];
    let i = 0, idx = 1;
    while (i < throws.length) {
      const res = throws[i].res;
      let count = 0;
      while (i < throws.length && throws[i].res === res) { count++; i++; }
      segs.push({ startIdx: idx, result: res, count });
      idx += count;
    }
    return segs;
  }

  // 連線紀錄：對當次批次擲杯做 run-length encoding
  const streaks = $derived(
    (() => {
      const result = [];
      let i = 0, idx = 1;
      while (i < currentThrows.length) {
        const res = currentThrows[i].res;
        let count = 0;
        while (i < currentThrows.length && currentThrows[i].res === res) { count++; i++; }
        result.push({ startIdx: idx, result: res, count });
        idx += count;
      }
      return result;
    })()
  );

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
      const streaks = computeStreaks(newThrows);
      history = [
        {
          id: now, time, prayer: prayer.trim(),
          throwCount: newThrows.length,
          stats,
          streaks,
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
  ─────────────────────────────────────────────────────────────
  pg-yang   凹面內側 radial gradient（中心略暗，邊緣略亮，呈現凹槽感）
  pg-spec   高光光暈 radial gradient（鏡面反光亮點）
  pg-yin    凸弧外側 radial gradient（中央亮→邊緣深暗，表現弧面受光）
  pg-gold   金色光暈 radial gradient（立杯神聖光暈）
-->
<svg width="0" height="0" aria-hidden="true" style="position:absolute;overflow:hidden">
  <defs>
    <!-- 陽面（凹面內側）：radial gradient，中心略暗（凹槽陰影），邊緣略亮（受光邊框） -->
    <radialGradient id="pg-yang" cx="50%" cy="60%" r="55%">
      <stop offset="0%"   stop-color={poeColor.yangD}/>
      <stop offset="50%"  stop-color={poeColor.yangM}/>
      <stop offset="100%" stop-color={poeColor.yangL}/>
    </radialGradient>

    <!-- 鏡面高光：橢圓形亮斑（用於陰面凸弧受光） -->
    <radialGradient id="pg-spec" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="rgba(255,230,230,0.90)"/>
      <stop offset="40%"  stop-color="rgba(255,200,200,0.45)"/>
      <stop offset="100%" stop-color="rgba(255,200,200,0)"/>
    </radialGradient>

    <!-- 陰面（凸弧外側）：更強的凸弧光澤感，中央最亮、邊緣深暗（立杯用） -->
    <radialGradient id="pg-yin" cx="38%" cy="28%" r="65%" fx="35%" fy="24%">
      <stop offset="0%"   stop-color={poeColor.yinB}/>
      <stop offset="25%"  stop-color={poeColor.yinM}/>
      <stop offset="65%"  stop-color={poeColor.yinD}/>
      <stop offset="100%" stop-color={poeColor.yinDk}/>
    </radialGradient>

    <!-- 右凸陰面高光（block1 陰面，高光在 bbox 上方偏右） -->
    <radialGradient id="pg-yin-R" cx="62%" cy="26%" r="65%" fx="60%" fy="22%">
      <stop offset="0%"   stop-color={poeColor.yinB}/>
      <stop offset="25%"  stop-color={poeColor.yinM}/>
      <stop offset="65%"  stop-color={poeColor.yinD}/>
      <stop offset="100%" stop-color={poeColor.yinDk}/>
    </radialGradient>

    <!-- 左凸陰面高光（block2 陰面，高光在 bbox 上方偏左） -->
    <radialGradient id="pg-yin-L" cx="38%" cy="26%" r="65%" fx="40%" fy="22%">
      <stop offset="0%"   stop-color={poeColor.yinB}/>
      <stop offset="25%"  stop-color={poeColor.yinM}/>
      <stop offset="65%"  stop-color={poeColor.yinD}/>
      <stop offset="100%" stop-color={poeColor.yinDk}/>
    </radialGradient>

    <!-- 立杯金光光暈 -->
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

    <!-- 說明區（可折疊，預設收合） -->
    <div class="w-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <button
        class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
        onclick={() => guideOpen = !guideOpen}
        aria-expanded={guideOpen}
      >
        <h2 class="flex items-center gap-3 text-gray-400 text-xs tracking-widest uppercase" style="font-family:'Noto Serif TC',serif">
          <span class="block w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></span>
          擲杯說明
          <span class="block w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></span>
        </h2>
        <span class="text-gray-400 text-[0.6rem] transition-transform duration-200 {guideOpen ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
      </button>
      {#if guideOpen}
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
      <!-- 自訂顏色：native color picker -->
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

    <!-- 筊杯展示區 -->
    <div class="flex items-end gap-10 justify-center py-2">

      <!-- 筊杯 1 -->
      <div class="flex flex-col items-center gap-2.5">
        <div class="block-wrapper {isAnimating ? 'animating' : ''}">
          {#if block1 === null}
            <!-- 未擲：暗沉輪廓（"(" 左凸形），彷彿靜靜等待 -->
            <svg class="poe-svg poe-dim" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="51" cy="142" rx="25" ry="4" fill="rgba(0,0,0,0.06)"/>
              <path d="M 100,15 A 75,60 0 0 0 100,135 A 22,60 0 0 1 100,15 Z" fill="#d4a0a0"/>
              <path d="M 100,15 A 75,60 0 0 0 100,135 A 22,60 0 0 1 100,15 Z" fill="none" stroke="#b08080" stroke-width="1.5"/>
            </svg>

          {:else if block1 === 0}
            <!-- 陽面：凹面朝左（"(" 形），側視圖木質感 -->
            <svg class="poe-svg poe-yang" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="51" cy="142" rx="25" ry="4" fill="rgba(0,0,0,0.12)"/>
              <path d="M 100,15 A 75,60 0 0 0 100,135 A 22,60 0 0 1 100,15 Z" fill="url(#pg-yang)"/>
              <!-- 凹面弧形木紋（沿左側弦月，y 方向走線） -->
              <path d="M 38,30 Q 55,75 38,120"  stroke="rgba(0,0,0,0.06)" stroke-width="0.9" fill="none" stroke-linecap="round"/>
              <path d="M 50,22 Q 64,75 50,128"  stroke="rgba(0,0,0,0.07)" stroke-width="1.0" fill="none" stroke-linecap="round"/>
              <path d="M 62,20 Q 72,75 62,130"  stroke="rgba(0,0,0,0.05)" stroke-width="0.8" fill="none" stroke-linecap="round"/>
              <!-- 凹面底端陰影弧 -->
              <path d="M 27,128 A 25,10 0 0 0 78,128" stroke="rgba(0,0,0,0.16)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <!-- 輪廓收邊暗線 -->
              <path d="M 100,15 A 75,60 0 0 0 100,135 A 22,60 0 0 1 100,15 Z" fill="none" stroke="rgba(20,0,0,0.22)" stroke-width="1.5"/>
              <!-- 陽字 -->
              <text x="50" y="80" text-anchor="middle"
                    fill="white" font-size="18"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="2"
                    stroke={poeColor.rim} stroke-width="3" paint-order="stroke">陽</text>
            </svg>

          {:else if block1 === 1}
            <!-- 陰面：凸面朝右（")" 形），側視圖強烈弧面受光 -->
            <svg class="poe-svg poe-yin" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="148" cy="142" rx="25" ry="4" fill="rgba(0,0,0,0.12)"/>
              <path d="M 100,15 A 75,60 0 0 1 100,135 A 22,60 0 0 0 100,15 Z" fill="url(#pg-yin-R)"/>
              <!-- 鏡面高光橢圓（右凸頂端） -->
              <ellipse cx="148" cy="44" rx="20" ry="28" fill="url(#pg-spec)" opacity="0.85" transform="rotate(5,148,44)"/>
              <!-- 亮線 -->
              <path d="M 112,35 Q 147,27 162,56" fill="none" stroke="rgba(255,235,235,0.68)" stroke-width="3.2" stroke-linecap="round"/>
              <!-- 外弧收邊暗線 -->
              <path d="M 100,15 A 75,60 0 0 1 100,135" fill="none" stroke="rgba(20,0,0,0.28)" stroke-width="1.5"/>
              <!-- 陰字 -->
              <text x="150" y="80" text-anchor="middle"
                    fill="white" font-size="18"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="2"
                    stroke={poeColor.rim} stroke-width="3" paint-order="stroke">陰</text>
            </svg>

          {:else}
            <!-- 立杯：筊杯側立，以最薄的稜面平衡（前視圖半圓弧） -->
            <svg class="poe-svg poe-li" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <!-- 金光光暈 -->
              <ellipse cx="100" cy="55" rx="55" ry="55" fill="url(#pg-gold)"/>
              <!-- 底部接地陰影 -->
              <ellipse cx="100" cy="140" rx="34" ry="4" fill="rgba(251,191,36,0.22)"/>
              <!-- 杯身：半圓弧直立（前視圖，平面在底，弧頂朝上） -->
              <path d="M 70,130 A 30,100 0 0 1 130,130 Z" fill="url(#pg-yin)"/>
              <!-- 底部平面邊 -->
              <rect x="70" y="130" width="60" height="4" rx="2" fill="#280808"/>
              <!-- 外弧紅漆邊線 -->
              <path d="M 70,130 A 30,100 0 0 1 130,130"
                    fill="none" stroke="#C41818" stroke-width="2" opacity="0.50" stroke-linecap="round"/>
              <!-- 漆面高光 -->
              <ellipse cx="88" cy="90" rx="18" ry="14"
                       fill="url(#pg-spec)" opacity="0.48"
                       transform="rotate(-10,88,90)"/>
              <!-- 中心豎線（神蹟之光） -->
              <path d="M 100,30 L 100,130"
                    stroke="rgba(251,191,36,0.22)" stroke-width="1"
                    stroke-linecap="round"/>
              <!-- 放射光芒（由弧頂放出） -->
              <g stroke="#fbbf24" stroke-linecap="round" opacity="0.85">
                <line x1="100" y1="28" x2="100" y2="17" stroke-width="2.5"/>
                <line x1="110" y1="31" x2="119" y2="21" stroke-width="2.0"/>
                <line x1="90"  y1="31" x2="81"  y2="21" stroke-width="2.0"/>
                <line x1="118" y1="37" x2="128" y2="28" stroke-width="1.6"/>
                <line x1="82"  y1="37" x2="72"  y2="28" stroke-width="1.6"/>
                <line x1="122" y1="47" x2="133" y2="39" stroke-width="1.3"/>
                <line x1="78"  y1="47" x2="67"  y2="39" stroke-width="1.3"/>
              </g>
              <!-- 立字 -->
              <text x="100" y="100" text-anchor="middle"
                    fill="#fbbf24" font-size="16"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="1"
                    stroke="#7C2006" stroke-width="3" paint-order="stroke">立</text>
            </svg>
          {/if}
        </div>
        {#if !isAnimating && block1 !== null}
          <span class="block-label {block1 === 0 ? 'yang-label' : block1 === 1 ? 'yin-label' : 'li-label'}">
            {block1 === 0 ? '陽面' : block1 === 1 ? '陰面' : '立！'}
          </span>
        {/if}
      </div>

      <!-- 中間裝飾 -->
      <div class="text-gray-300 text-base pb-10" aria-hidden="true">✦</div>

      <!-- 筊杯 2（SVG 造型相同，對應 block2 狀態） -->
      <div class="flex flex-col items-center gap-2.5">
        <div class="block-wrapper {isAnimating ? 'animating animating-delay' : ''}">
          {#if block2 === null}
            <!-- 未擲：暗沉輪廓（")" 右凸形），彷彿靜靜等待 -->
            <svg class="poe-svg poe-dim" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="148" cy="142" rx="25" ry="4" fill="rgba(0,0,0,0.06)"/>
              <path d="M 100,15 A 75,60 0 0 1 100,135 A 22,60 0 0 0 100,15 Z" fill="#d4a0a0"/>
              <path d="M 100,15 A 75,60 0 0 1 100,135 A 22,60 0 0 0 100,15 Z" fill="none" stroke="#b08080" stroke-width="1.5"/>
            </svg>
          {:else if block2 === 0}
            <!-- 陽面：凹面朝右（")" 形），側視圖木質感 -->
            <svg class="poe-svg poe-yang" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="148" cy="142" rx="25" ry="4" fill="rgba(0,0,0,0.12)"/>
              <path d="M 100,15 A 75,60 0 0 1 100,135 A 22,60 0 0 0 100,15 Z" fill="url(#pg-yang)"/>
              <!-- 凹面弧形木紋（沿右側弦月，y 方向走線） -->
              <path d="M 162,30 Q 145,75 162,120" stroke="rgba(0,0,0,0.06)" stroke-width="0.9" fill="none" stroke-linecap="round"/>
              <path d="M 150,22 Q 136,75 150,128" stroke="rgba(0,0,0,0.07)" stroke-width="1.0" fill="none" stroke-linecap="round"/>
              <path d="M 138,20 Q 128,75 138,130" stroke="rgba(0,0,0,0.05)" stroke-width="0.8" fill="none" stroke-linecap="round"/>
              <!-- 凹面底端陰影弧 -->
              <path d="M 122,128 A 25,10 0 0 1 173,128" stroke="rgba(0,0,0,0.16)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <!-- 輪廓收邊暗線 -->
              <path d="M 100,15 A 75,60 0 0 1 100,135 A 22,60 0 0 0 100,15 Z" fill="none" stroke="rgba(20,0,0,0.22)" stroke-width="1.5"/>
              <!-- 陽字 -->
              <text x="150" y="80" text-anchor="middle"
                    fill="white" font-size="18"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="2"
                    stroke={poeColor.rim} stroke-width="3" paint-order="stroke">陽</text>
            </svg>
          {:else if block2 === 1}
            <!-- 陰面：凸面朝左（"(" 形），側視圖強烈弧面受光 -->
            <svg class="poe-svg poe-yin" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="51" cy="142" rx="25" ry="4" fill="rgba(0,0,0,0.12)"/>
              <path d="M 100,15 A 75,60 0 0 0 100,135 A 22,60 0 0 1 100,15 Z" fill="url(#pg-yin-L)"/>
              <!-- 鏡面高光橢圓（左凸頂端） -->
              <ellipse cx="51" cy="44" rx="20" ry="28" fill="url(#pg-spec)" opacity="0.85" transform="rotate(-5,51,44)"/>
              <!-- 亮線 -->
              <path d="M 88,35 Q 53,27 38,56" fill="none" stroke="rgba(255,235,235,0.68)" stroke-width="3.2" stroke-linecap="round"/>
              <!-- 外弧收邊暗線 -->
              <path d="M 100,15 A 75,60 0 0 0 100,135" fill="none" stroke="rgba(20,0,0,0.28)" stroke-width="1.5"/>
              <!-- 陰字 -->
              <text x="50" y="80" text-anchor="middle"
                    fill="white" font-size="18"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="2"
                    stroke={poeColor.rim} stroke-width="3" paint-order="stroke">陰</text>
            </svg>
          {:else}
            <svg class="poe-svg poe-li" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="55" rx="55" ry="55" fill="url(#pg-gold)"/>
              <ellipse cx="100" cy="140" rx="34" ry="4" fill="rgba(251,191,36,0.22)"/>
              <path d="M 70,130 A 30,100 0 0 1 130,130 Z" fill="url(#pg-yin)"/>
              <rect x="70" y="130" width="60" height="4" rx="2" fill="#280808"/>
              <path d="M 70,130 A 30,100 0 0 1 130,130"
                    fill="none" stroke="#C41818" stroke-width="2" opacity="0.50" stroke-linecap="round"/>
              <ellipse cx="88" cy="90" rx="18" ry="14"
                       fill="url(#pg-spec)" opacity="0.48"
                       transform="rotate(-10,88,90)"/>
              <path d="M 100,30 L 100,130"
                    stroke="rgba(251,191,36,0.22)" stroke-width="1"
                    stroke-linecap="round"/>
              <g stroke="#fbbf24" stroke-linecap="round" opacity="0.85">
                <line x1="100" y1="28" x2="100" y2="17" stroke-width="2.5"/>
                <line x1="110" y1="31" x2="119" y2="21" stroke-width="2.0"/>
                <line x1="90"  y1="31" x2="81"  y2="21" stroke-width="2.0"/>
                <line x1="118" y1="37" x2="128" y2="28" stroke-width="1.6"/>
                <line x1="82"  y1="37" x2="72"  y2="28" stroke-width="1.6"/>
                <line x1="122" y1="47" x2="133" y2="39" stroke-width="1.3"/>
                <line x1="78"  y1="47" x2="67"  y2="39" stroke-width="1.3"/>
              </g>
              <text x="100" y="100" text-anchor="middle"
                    fill="#fbbf24" font-size="16"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="1"
                    stroke="#7C2006" stroke-width="3" paint-order="stroke">立</text>
            </svg>
          {/if}
        </div>
        {#if !isAnimating && block2 !== null}
          <span class="block-label {block2 === 0 ? 'yang-label' : block2 === 1 ? 'yin-label' : 'li-label'}">
            {block2 === 0 ? '陽面' : block2 === 1 ? '陰面' : '立！'}
          </span>
        {/if}
      </div>
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
        <!-- N=1：沿用原本的結果卡片 -->
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
      {:else}
        <!-- N>1：全部結果 compact 清單 -->
        <div class="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {#if currentThrows.length <= DETAIL_LIMIT}
            <ul class="divide-y divide-gray-100">
              {#each currentThrows as t, i}
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
              共 {currentThrows.length} 擲，顯示統計與連線摘要
            </div>
          {/if}
          <!-- 統計 bar -->
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
          <!-- 連線紀錄 -->
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
            {@const isBatch = entry.throwCount > 1}
            {@const firstRes = entry.streaks[0]?.result ?? 'sheng'}
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
                          entry.stats.yin   ? `陰×${entry.stats.yin}` : '',
                          entry.stats.xiao  ? `笑×${entry.stats.xiao}` : '',
                          entry.stats.li    ? `立×${entry.stats.li}` : '',
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
          {/each}
        </ul>
      {/if}
      {/if}
    </div>

  </div>
</div>

<style>
  /* ── 筊杯動畫 wrapper ── */
  .block-wrapper {
    width: 168px; height: 153px;
    display: flex; align-items: flex-end; justify-content: center;
  }
  .block-wrapper.animating { animation: poe-flip 1.1s ease-in-out; }
  .block-wrapper.animating-delay { animation-delay: 0.08s; }

  @keyframes poe-flip {
    0%   { transform: translateY(0)     rotate(0deg); }
    20%  { transform: translateY(-72px)  rotate(200deg); }
    45%  { transform: translateY(-100px) rotate(372deg); }
    70%  { transform: translateY(-46px)  rotate(472deg); }
    85%  { transform: translateY(-14px)  rotate(532deg); }
    100% { transform: translateY(0)     rotate(540deg); }
  }

  /* ── 筊杯 SVG 基礎 ── */
  .poe-svg { width: 152px; height: 132px; transition: transform 0.3s; }

  .poe-dim {
    opacity: 0.50;
    filter: drop-shadow(0 3px 8px rgba(0,0,0,0.08));
  }

  .poe-yang {
    filter:
      drop-shadow(0 4px 12px rgba(0,0,0,0.13))
      drop-shadow(0 0 10px rgba(200,24,24,0.18));
  }

  .poe-yin {
    filter:
      drop-shadow(0 4px 12px rgba(0,0,0,0.13))
      drop-shadow(0 0 10px rgba(200,24,24,0.16));
  }

  .poe-li {
    filter:
      drop-shadow(0 4px 12px rgba(0,0,0,0.12))
      drop-shadow(0 0 20px rgba(251,191,36,0.52));
    animation: li-glow 1s ease-in-out infinite alternate;
  }

  @keyframes li-glow {
    from { filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12)) drop-shadow(0 0 10px rgba(251,191,36,0.38)); }
    to   { filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12)) drop-shadow(0 0 28px rgba(251,191,36,0.72)); }
  }

  /* ── 筊杯標籤 ── */
  .block-label {
    font-size: 0.8rem; letter-spacing: 0.06em;
    font-weight: 600; font-family: 'Noto Serif TC', serif;
  }
  .yang-label { color: #dc2626; }
  .yin-label  { color: #b45309; }
  .li-label   { color: #ca8a04; font-weight: 700; animation: li-pulse 0.85s ease-in-out infinite alternate; }

  @keyframes li-pulse {
    from { opacity: 0.8; }
    to   { opacity: 1; text-shadow: 0 0 8px rgba(202,138,4,0.7); }
  }

  /* ── 擲杯按鈕光澤動畫 ── */
  .throw-btn::before {
    content: ''; position: absolute; top: 0; left: -70%;
    width: 45%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transform: skewX(-20deg); transition: left 0.55s ease; pointer-events: none;
  }
  .throw-btn:hover:not(:disabled)::before { left: 160%; }
  .throw-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .throw-btn:active:not(:disabled) { transform: translateY(0); }

  /* ── 載入旋轉 ── */
  .btn-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4); border-top-color: white;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── 結果卡片動畫 ── */
  @keyframes result-appear {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes li-card-glow {
    from { box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 0 12px rgba(251,191,36,0.10); }
    to   { box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 0 40px rgba(251,191,36,0.24); }
  }

  /* 結果卡片：border 顏色 + 文字色 */
  .result-li    { border-color: #fbbf24; animation: result-appear 0.42s ease-out, li-card-glow 1.6s ease-in-out infinite alternate; }
  .result-sheng { border-color: #6ee7b7; animation: result-appear 0.42s ease-out; }
  .result-yin   { border-color: #d1d5db; animation: result-appear 0.42s ease-out; }
  .result-xiao  { border-color: #fcd34d; animation: result-appear 0.42s ease-out; }

  .result-li    .result-name { color: #ca8a04; }
  .result-sheng .result-name { color: #059669; }
  .result-yin   .result-name { color: #6b7280; }
  .result-xiao  .result-name { color: #d97706; }

  .result-li    .result-subtitle { color: #d97706; }
  .result-sheng .result-subtitle { color: #10b981; }
  .result-yin   .result-subtitle { color: #9ca3af; }
  .result-xiao  .result-subtitle { color: #f59e0b; }

  /* ── 歷史紀錄條目 ── */
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

  /* ── 歷史紀錄迷你標籤 ── */
  .mini-block {
    font-size: 0.7rem; font-weight: 700;
    padding: 0.1rem 0.35rem; border-radius: 0.25rem;
    letter-spacing: 0.03em; font-family: 'Noto Serif TC', serif;
  }
  .mini-yang { color: #dc2626; background: rgba(220,38,38,0.08); }
  .mini-yin  { color: #b45309; background: rgba(180,83,9,0.08); }
  .mini-li   { color: #ca8a04; background: rgba(202,138,4,0.10); }

  /* ── 歷史紀錄結果文字色 ── */
  .entry-result-li    { color: #ca8a04; }
  .entry-result-sheng { color: #059669; }
  .entry-result-yin   { color: #6b7280; }
  .entry-result-xiao  { color: #d97706; }

  /* ── 祈求折疊 ── */
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

  /* ── 每條紀錄折疊 ── */
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
