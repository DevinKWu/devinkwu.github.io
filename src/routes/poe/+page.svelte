<script>
  import { onMount } from 'svelte';

  let isAnimating = $state(false);
  let block1 = $state(null); // null = 未擲, 0 = 陽面, 1 = 陰面, 2 = 立
  let block2 = $state(null);
  let prayer = $state('');
  let hasThrown = $state(false);

  // 歷史紀錄：{ id, time, prayer, block1, block2, result }
  let history = $state([]);
  let historyLoaded = false;

  onMount(() => {
    try {
      const saved = localStorage.getItem('poe-history');
      if (saved) history = JSON.parse(saved);
    } catch {}
    historyLoaded = true;
  });

  $effect(() => {
    if (historyLoaded) {
      localStorage.setItem('poe-history', JSON.stringify(history));
    }
  });

  function clearHistory() {
    history = [];
  }

  const result = $derived(
    block1 === null ? null :
    block1 === 2 || block2 === 2 ? 'li' :
    block1 !== block2 ? 'sheng' :
    block1 === 0 ? 'yin' : 'xiao'
  );

  const resultMap = {
    li: {
      name: '立杯',
      subtitle: '神蹟顯現',
      message: '萬中無一的神蹟！筊杯直立而不倒，此乃神明強烈降臨之徵兆，所求之事意義非凡，必得虔誠感恩並認真對待此天啟。',
      note: '筊杯直立，9007兆分之一的奇蹟',
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

  const resultInfo = $derived(result ? resultMap[result] : null);

  function throwPoe() {
    if (isAnimating) return;
    hasThrown = true;
    isAnimating = true;
    block1 = null;
    block2 = null;

    setTimeout(() => {
      // 每支筊杯有 1/9007199254740991 機率直立（立杯）
      const rollBlock = () => Math.random() < 1 / Number.MAX_SAFE_INTEGER ? 2 : Math.floor(Math.random() * 2);
      const b1 = rollBlock();
      const b2 = rollBlock();
      block1 = b1;
      block2 = b2;
      isAnimating = false;

      const res = b1 === 2 || b2 === 2 ? 'li' : b1 !== b2 ? 'sheng' : b1 === 0 ? 'yin' : 'xiao';
      history = [
        {
          id: Date.now(),
          time: new Date().toLocaleString('zh-TW', { hour12: false }),
          prayer: prayer.trim(),
          block1: b1,
          block2: b2,
          result: res,
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
  pg-yang   紅漆凸面 radial gradient（模擬拱面受光）
  pg-spec   高光光暈 radial gradient（鏡面反光亮點）
  pg-rim    底部輪廓暗面 linear gradient
  pg-yin    木質平面 linear gradient（竹/木紋底色）
  pg-li     立杯身 linear gradient
  pg-gold   金色光暈 radial gradient
-->
<svg width="0" height="0" aria-hidden="true" style="position:absolute;overflow:hidden">
  <defs>
    <!-- 陽面（平整內側）：均勻紅漆，輕微線性漸層，表現平整無弧感 -->
    <linearGradient id="pg-yang" x1="38%" y1="0%" x2="62%" y2="100%">
      <stop offset="0%"   stop-color="#E83030"/>
      <stop offset="45%"  stop-color="#C82020"/>
      <stop offset="100%" stop-color="#A81414"/>
    </linearGradient>

    <!-- 鏡面高光：橢圓形亮斑（用於陰面凸弧受光） -->
    <radialGradient id="pg-spec" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="rgba(255,230,230,0.90)"/>
      <stop offset="40%"  stop-color="rgba(255,200,200,0.45)"/>
      <stop offset="100%" stop-color="rgba(255,200,200,0)"/>
    </radialGradient>

    <!-- 底部厚度暗面 -->
    <linearGradient id="pg-rim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#3E0606"/>
      <stop offset="100%" stop-color="#240404"/>
    </linearGradient>

    <!-- 陰面（凸弧外側）：中央亮紅、邊緣深暗，表現圓弧面受光 -->
    <radialGradient id="pg-yin" cx="40%" cy="32%" r="62%" fx="38%" fy="28%">
      <stop offset="0%"   stop-color="#FF5050"/>
      <stop offset="30%"  stop-color="#E02424"/>
      <stop offset="70%"  stop-color="#B01616"/>
      <stop offset="100%" stop-color="#820A0A"/>
    </radialGradient>

    <!-- 陰面底部厚度 -->
    <linearGradient id="pg-yin-rim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#4A2008"/>
      <stop offset="100%" stop-color="#2C1004"/>
    </linearGradient>

    <!-- 立杯身：深紅褐轉黑 -->
    <linearGradient id="pg-li-body" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#7C2006"/>
      <stop offset="50%"  stop-color="#5A1604"/>
      <stop offset="100%" stop-color="#7C2006"/>
    </linearGradient>

    <!-- 立杯金光光暈 -->
    <radialGradient id="pg-gold" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="rgba(253,211,77,0.55)"/>
      <stop offset="100%" stop-color="rgba(253,211,77,0)"/>
    </radialGradient>
  </defs>
</svg>

<div class="poe-page">
  <!-- 背景光暈 -->
  <div class="bg-decor" aria-hidden="true">
    <div class="bg-circle c1"></div>
    <div class="bg-circle c2"></div>
    <div class="bg-circle c3"></div>
    <div class="bg-circle c4"></div>
  </div>

  <div class="content-wrapper">
    <!-- 標題區 -->
    <header class="header">
      <a href="/" class="back-link">← 回首頁</a>
      <div class="title-block">
        <div class="title-deco">
          <span class="deco-line"></span>
          <span class="deco-diamond">◆</span>
          <span class="deco-line"></span>
        </div>
        <h1 class="main-title">擲杯</h1>
        <p class="main-subtitle">傳統台灣廟宇問卜儀式</p>
        <div class="title-deco title-deco-sm">
          <span class="deco-line"></span>
          <span class="deco-text">誠心問卜・神明指引</span>
          <span class="deco-line"></span>
        </div>
      </div>
    </header>

    <!-- 祈求欄 -->
    <div class="prayer-section">
      <label class="prayer-label" for="prayer-input">心中默念您的祈求（選填）</label>
      <textarea
        id="prayer-input"
        bind:value={prayer}
        placeholder="在此輸入您想請示神明的問題..."
        class="prayer-input"
        rows="2"
      ></textarea>
    </div>

    <!-- 筊杯展示區 -->
    <div class="blocks-area">

      <!-- 筊杯 1 -->
      <div class="block-container">
        <div class="block-wrapper {isAnimating ? 'animating' : ''}">
          {#if block1 === null}
            <!--
              未擲：暗沉的陽面輪廓，彷彿靜靜等待
            -->
            <svg class="poe-svg poe-dim" viewBox="0 0 200 132" xmlns="http://www.w3.org/2000/svg">
              <!-- 落地陰影 -->
              <ellipse cx="100" cy="114" rx="70" ry="7" fill="rgba(0,0,0,0.15)"/>
              <!-- 側邊厚度（下移月牙，深暗色） -->
              <path d="M 16,87 A 84,58 0 0 0 184,87 A 84,6 0 0 0 16,87 Z" fill="#180404"/>
              <!-- 月牙形杯身（暗沉未擲） -->
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="#0E0202"/>
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="none" stroke="#1C0808" stroke-width="1.5"/>
            </svg>

          {:else if block1 === 0}
            <!--
              陽面：弓形紅漆凸面朝上
              • 兩段曲線拼出舟形輪廓（尖頭兩端、弧頂中央）
              • radial gradient 模擬凸面受光
              • 橢圓 + 弧線打出鏡面高光
              • 底部暗帶表現厚度
            -->
            <svg class="poe-svg poe-yang" viewBox="0 0 200 132" xmlns="http://www.w3.org/2000/svg">
              <!-- 落地陰影 -->
              <ellipse cx="100" cy="114" rx="70" ry="7" fill="rgba(80,4,4,0.25)"/>
              <!-- 側邊厚度（下移月牙，暗紅） -->
              <path d="M 16,87 A 84,58 0 0 0 184,87 A 84,6 0 0 0 16,87 Z" fill="#3E0606"/>
              <!-- 陽面：月牙形平整內側（均勻紅漆，無凸弧高光） -->
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="url(#pg-yang)"/>
              <!-- 內弧邊緣淡亮線（光滑平面質感） -->
              <path d="M 24,80 A 76,50 0 0 0 176,80" fill="none" stroke="rgba(255,210,210,0.25)" stroke-width="3" stroke-linecap="round"/>
              <!-- 輪廓收邊暗線 -->
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="none" stroke="rgba(20,0,0,0.30)" stroke-width="1.5"/>
              <!-- 陽字（白字深框，月牙中央） -->
              <text x="100" y="56" text-anchor="middle"
                    fill="white" font-size="18"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="2"
                    stroke="#660808" stroke-width="3" paint-order="stroke">陽</text>
            </svg>

          {:else if block1 === 1}
            <!--
              陰面：木質平面朝上
              • 弧度較淺（凹槽感）
              • radial gradient 呈現竹木底色
              • 多條 Q-bezier 曲線仿木紋
              • 底部較深暗木色邊
            -->
            <svg class="poe-svg poe-yin" viewBox="0 0 200 132" xmlns="http://www.w3.org/2000/svg">
              <!-- 落地陰影（凸弧面，陰影稍深） -->
              <ellipse cx="100" cy="114" rx="70" ry="7" fill="rgba(80,4,4,0.30)"/>
              <!-- 側邊厚度（下移月牙，暗紅） -->
              <path d="M 16,87 A 84,58 0 0 0 184,87 A 84,6 0 0 0 16,87 Z" fill="#3E0606"/>
              <!-- 陰面：月牙形凸弧外側（強烈弧面受光） -->
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="url(#pg-yin)"/>
              <!-- 鏡面高光（凸弧左上受光最強處） -->
              <ellipse cx="68" cy="44" rx="32" ry="13" fill="url(#pg-spec)" opacity="0.80" transform="rotate(-8,68,44)"/>
              <!-- 鏡面亮線（弧面高光反射） -->
              <path d="M 38,55 Q 68,36 108,42" fill="none" stroke="rgba(255,235,235,0.70)" stroke-width="2.5" stroke-linecap="round"/>
              <!-- 外弧收邊暗線 -->
              <path d="M 16,82 A 84,58 0 0 0 184,82" fill="none" stroke="rgba(20,0,0,0.35)" stroke-width="1.5"/>
              <!-- 陰字（白字深框，月牙中央） -->
              <text x="100" y="56" text-anchor="middle"
                    fill="white" font-size="18"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="2"
                    stroke="#660808" stroke-width="3" paint-order="stroke">陰</text>
            </svg>

          {:else}
            <!--
              立杯：筊杯側立，以最薄的稜面平衡
              • 紡錘形身形（上下尖、中間寬）
              • 一側紅漆、一側木色，視覺上分兩半
              • 頂端金色光暈 + 放射光芒
            -->
            <svg class="poe-svg poe-li" viewBox="0 0 200 132" xmlns="http://www.w3.org/2000/svg">
              <!-- 底部光暈陰影 -->
              <!-- 立杯金光光圈（D 形弧頂神聖光暈） -->
              <ellipse cx="100" cy="40" rx="50" ry="50" fill="url(#pg-gold)"/>
              <!-- 底部小陰影（直立時接地面小） -->
              <ellipse cx="100" cy="120" rx="52" ry="5" fill="rgba(251,191,36,0.30)"/>

              <!-- 杯身主體（紡錘形） -->
              <!-- 杯身：半圓 D 形直立，平面在底，弧頂朝上 -->
              <path d="M 48,110 A 52,70 0 0 0 152,110 Z" fill="url(#pg-yin)"/>
              <!-- 底部平面邊厚 -->
              <path d="M 48,110 L 152,110 L 152,118 A 52,9 0 0 1 48,118 Z" fill="#280808"/>
              <!-- 外弧紅漆面邊線 -->
              <path d="M 48,110 A 52,70 0 0 0 152,110"
                    fill="none" stroke="#C41818" stroke-width="2.5" opacity="0.60" stroke-linecap="round"/>
              <!-- 漆面高光 -->
              <ellipse cx="84" cy="82" rx="26" ry="20"
                       fill="url(#pg-spec)" opacity="0.52"
                       transform="rotate(-10,84,82)"/>

              <!-- 右側：紅漆面稜線反光 -->
              <!-- 中心豎線（神蹟之光，由弧頂至平面） -->
              <path d="M 100,40 L 100,110"
                    stroke="rgba(251,191,36,0.28)" stroke-width="1.2"
                    stroke-linecap="round"/>

              <!-- 放射光芒 -->
              <!-- 放射光芒（由 D 形弧頂放出） -->
              <g stroke="#fbbf24" stroke-linecap="round" opacity="0.85">
                <line x1="100" y1="35" x2="100" y2="24" stroke-width="2.5"/>
                <line x1="110" y1="38" x2="119" y2="28" stroke-width="2.0"/>
                <line x1="90"  y1="38" x2="81"  y2="28" stroke-width="2.0"/>
                <line x1="118" y1="44" x2="128" y2="35" stroke-width="1.6"/>
                <line x1="82"  y1="44" x2="72"  y2="35" stroke-width="1.6"/>
                <line x1="122" y1="54" x2="133" y2="46" stroke-width="1.3"/>
                <line x1="78"  y1="54" x2="67"  y2="46" stroke-width="1.3"/>
                <line x1="124" y1="65" x2="136" y2="59" stroke-width="1.0"/>
                <line x1="76"  y1="65" x2="64"  y2="59" stroke-width="1.0"/>
              </g>

              <!-- 立字 -->
              <text x="100" y="90" text-anchor="middle"
                    fill="#fbbf24" font-size="17"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="1"
                    stroke="#1A0400" stroke-width="3" paint-order="stroke">立</text>
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
      <div class="divider-icon" aria-hidden="true">✦</div>

      <!-- 筊杯 2（SVG 造型相同，對應 block2 狀態） -->
      <div class="block-container">
        <div class="block-wrapper {isAnimating ? 'animating animating-delay' : ''}">
          {#if block2 === null}
            <svg class="poe-svg poe-dim" viewBox="0 0 200 132" xmlns="http://www.w3.org/2000/svg">
              <!-- 落地陰影 -->
              <ellipse cx="100" cy="114" rx="70" ry="7" fill="rgba(0,0,0,0.15)"/>
              <!-- 側邊厚度（下移月牙，深暗色） -->
              <path d="M 16,87 A 84,58 0 0 0 184,87 A 84,6 0 0 0 16,87 Z" fill="#180404"/>
              <!-- 月牙形杯身（暗沉未擲） -->
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="#0E0202"/>
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="none" stroke="#1C0808" stroke-width="1.5"/>
            </svg>
          {:else if block2 === 0}
            <svg class="poe-svg poe-yang" viewBox="0 0 200 132" xmlns="http://www.w3.org/2000/svg">
              <!-- 落地陰影 -->
              <ellipse cx="100" cy="114" rx="70" ry="7" fill="rgba(80,4,4,0.25)"/>
              <!-- 側邊厚度（下移月牙，暗紅） -->
              <path d="M 16,87 A 84,58 0 0 0 184,87 A 84,6 0 0 0 16,87 Z" fill="#3E0606"/>
              <!-- 陽面：月牙形平整內側（均勻紅漆，無凸弧高光） -->
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="url(#pg-yang)"/>
              <!-- 內弧邊緣淡亮線（光滑平面質感） -->
              <path d="M 24,80 A 76,50 0 0 0 176,80" fill="none" stroke="rgba(255,210,210,0.25)" stroke-width="3" stroke-linecap="round"/>
              <!-- 輪廓收邊暗線 -->
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="none" stroke="rgba(20,0,0,0.30)" stroke-width="1.5"/>
              <!-- 陽字（白字深框，月牙中央） -->
              <text x="100" y="56" text-anchor="middle"
                    fill="white" font-size="18"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="2"
                    stroke="#660808" stroke-width="3" paint-order="stroke">陽</text>
            </svg>
          {:else if block2 === 1}
            <svg class="poe-svg poe-yin" viewBox="0 0 200 132" xmlns="http://www.w3.org/2000/svg">
              <!-- 落地陰影（凸弧面，陰影稍深） -->
              <ellipse cx="100" cy="114" rx="70" ry="7" fill="rgba(80,4,4,0.30)"/>
              <!-- 側邊厚度（下移月牙，暗紅） -->
              <path d="M 16,87 A 84,58 0 0 0 184,87 A 84,6 0 0 0 16,87 Z" fill="#3E0606"/>
              <!-- 陰面：月牙形凸弧外側（強烈弧面受光） -->
              <path d="M 16,82 A 84,58 0 0 0 184,82 A 84,6 0 0 0 16,82 Z" fill="url(#pg-yin)"/>
              <!-- 鏡面高光（凸弧左上受光最強處） -->
              <ellipse cx="68" cy="44" rx="32" ry="13" fill="url(#pg-spec)" opacity="0.80" transform="rotate(-8,68,44)"/>
              <!-- 鏡面亮線（弧面高光反射） -->
              <path d="M 38,55 Q 68,36 108,42" fill="none" stroke="rgba(255,235,235,0.70)" stroke-width="2.5" stroke-linecap="round"/>
              <!-- 外弧收邊暗線 -->
              <path d="M 16,82 A 84,58 0 0 0 184,82" fill="none" stroke="rgba(20,0,0,0.35)" stroke-width="1.5"/>
              <!-- 陰字（白字深框，月牙中央） -->
              <text x="100" y="56" text-anchor="middle"
                    fill="white" font-size="18"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="2"
                    stroke="#660808" stroke-width="3" paint-order="stroke">陰</text>
            </svg>
          {:else}
            <svg class="poe-svg poe-li" viewBox="0 0 200 132" xmlns="http://www.w3.org/2000/svg">
              <!-- 立杯金光光圈（D 形弧頂神聖光暈） -->
              <ellipse cx="100" cy="40" rx="50" ry="50" fill="url(#pg-gold)"/>
              <!-- 底部小陰影（直立時接地面小） -->
              <ellipse cx="100" cy="120" rx="52" ry="5" fill="rgba(251,191,36,0.30)"/>
              <!-- 杯身：半圓 D 形直立，平面在底，弧頂朝上 -->
              <path d="M 48,110 A 52,70 0 0 0 152,110 Z" fill="url(#pg-yin)"/>
              <!-- 底部平面邊厚 -->
              <path d="M 48,110 L 152,110 L 152,118 A 52,9 0 0 1 48,118 Z" fill="#280808"/>
              <!-- 外弧紅漆面邊線 -->
              <path d="M 48,110 A 52,70 0 0 0 152,110"
                    fill="none" stroke="#C41818" stroke-width="2.5" opacity="0.60" stroke-linecap="round"/>
              <!-- 漆面高光 -->
              <ellipse cx="84" cy="82" rx="26" ry="20"
                       fill="url(#pg-spec)" opacity="0.52"
                       transform="rotate(-10,84,82)"/>
              <!-- 中心豎線（神蹟之光，由弧頂至平面） -->
              <path d="M 100,40 L 100,110"
                    stroke="rgba(251,191,36,0.28)" stroke-width="1.2"
                    stroke-linecap="round"/>
              <!-- 放射光芒（由 D 形弧頂放出） -->
              <g stroke="#fbbf24" stroke-linecap="round" opacity="0.85">
                <line x1="100" y1="35" x2="100" y2="24" stroke-width="2.5"/>
                <line x1="110" y1="38" x2="119" y2="28" stroke-width="2.0"/>
                <line x1="90"  y1="38" x2="81"  y2="28" stroke-width="2.0"/>
                <line x1="118" y1="44" x2="128" y2="35" stroke-width="1.6"/>
                <line x1="82"  y1="44" x2="72"  y2="35" stroke-width="1.6"/>
                <line x1="122" y1="54" x2="133" y2="46" stroke-width="1.3"/>
                <line x1="78"  y1="54" x2="67"  y2="46" stroke-width="1.3"/>
                <line x1="124" y1="65" x2="136" y2="59" stroke-width="1.0"/>
                <line x1="76"  y1="65" x2="64"  y2="59" stroke-width="1.0"/>
              </g>
              <text x="100" y="90" text-anchor="middle"
                    fill="#fbbf24" font-size="17"
                    font-family="'Noto Serif TC',serif" font-weight="bold"
                    letter-spacing="1"
                    stroke="#1A0400" stroke-width="3" paint-order="stroke">立</text>
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

    <!-- 擲杯按鈕 -->
    <button
      class="throw-btn {isAnimating ? 'throw-btn-active' : ''}"
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
    {#if resultInfo && !isAnimating}
      <div class="result-card {resultInfo.colorClass}">
        <div class="result-inner">
          <div class="result-name">{resultInfo.name}</div>
          <div class="result-subtitle">{resultInfo.subtitle}</div>
          <p class="result-message">{resultInfo.message}</p>
          <div class="result-note">{resultInfo.note}</div>
        </div>
      </div>
    {:else if !hasThrown}
      <div class="placeholder-text">誠心默念，點擊擲杯</div>
    {/if}

    <!-- 說明區 -->
    <div class="guide-section">
      <h2 class="section-title">
        <span class="section-line"></span>
        擲杯說明
        <span class="section-line"></span>
      </h2>
      <div class="guide-grid">
        <div class="guide-item guide-sheng">
          <div class="guide-icon">聖</div>
          <div class="guide-name">聖杯</div>
          <div class="guide-desc">一陽一陰</div>
          <div class="guide-meaning">神明允許</div>
        </div>
        <div class="guide-item guide-yin">
          <div class="guide-icon">陰</div>
          <div class="guide-name">陰杯</div>
          <div class="guide-desc">兩個平面</div>
          <div class="guide-meaning">神明不允</div>
        </div>
        <div class="guide-item guide-xiao">
          <div class="guide-icon">笑</div>
          <div class="guide-name">笑杯</div>
          <div class="guide-desc">兩個弧面</div>
          <div class="guide-meaning">再擲一次</div>
        </div>
      </div>
      <div class="guide-item guide-li guide-li-full">
        <div class="guide-icon guide-li-icon">立</div>
        <div class="guide-li-body">
          <div class="guide-name">立杯</div>
          <div class="guide-desc">筊杯直立不倒，9007兆分之一</div>
          <div class="guide-meaning">神蹟顯現，極為罕見</div>
        </div>
      </div>
    </div>

    <!-- 歷史紀錄 -->
    <div class="history-section">
      <div class="history-header">
        <h2 class="section-title">
          <span class="section-line"></span>
          擲杯紀錄
          <span class="section-line"></span>
        </h2>
        {#if history.length > 0}
          <button class="clear-btn" onclick={clearHistory}>清除紀錄</button>
        {/if}
      </div>

      {#if history.length === 0}
        <p class="history-empty">尚無擲杯紀錄</p>
      {:else}
        <ul class="history-list">
          {#each history as entry (entry.id)}
            <li class="history-entry history-entry-{entry.result}">
              <div class="entry-meta">
                <span class="entry-time">{entry.time}</span>
                {#if entry.prayer}
                  <span class="entry-prayer">「{entry.prayer}」</span>
                {/if}
              </div>
              <div class="entry-result-row">
                <div class="entry-blocks">
                  <span class="mini-block {entry.block1 === 0 ? 'mini-yang' : entry.block1 === 1 ? 'mini-yin' : 'mini-li'}">
                    {entry.block1 === 0 ? '陽' : entry.block1 === 1 ? '陰' : '立'}
                  </span>
                  <span class="entry-sep">·</span>
                  <span class="mini-block {entry.block2 === 0 ? 'mini-yang' : entry.block2 === 1 ? 'mini-yin' : 'mini-li'}">
                    {entry.block2 === 0 ? '陽' : entry.block2 === 1 ? '陰' : '立'}
                  </span>
                </div>
                <span class="entry-arrow">→</span>
                <span class="entry-result entry-result-{entry.result}">
                  {resultMap[entry.result].name}
                </span>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>

<style>
  /* ── 整體頁面 ── */
  .poe-page {
    min-height: calc(100vh - 4rem);
    background: #080405;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  /* ── 背景光暈 ── */
  .bg-decor { position: absolute; inset: 0; pointer-events: none; }

  .bg-circle { position: absolute; border-radius: 9999px; filter: blur(90px); }

  .c1 {
    width: 720px; height: 720px;
    background: radial-gradient(circle, #8B1A1A 0%, transparent 70%);
    opacity: 0.13; top: -180px; left: 50%; transform: translateX(-50%);
  }
  .c2 {
    width: 480px; height: 480px;
    background: radial-gradient(circle, #78350f 0%, transparent 70%);
    opacity: 0.10; bottom: -60px; right: -100px;
  }
  .c3 {
    width: 360px; height: 360px;
    background: radial-gradient(circle, #92400e 0%, transparent 70%);
    opacity: 0.09; bottom: 28%; left: -90px;
  }
  .c4 {
    width: 220px; height: 220px;
    background: radial-gradient(circle, #B91C1C 0%, transparent 70%);
    opacity: 0.07; top: 32%; right: 4%;
  }

  /* ── 內容容器 ── */
  .content-wrapper {
    position: relative; z-index: 10;
    width: 100%; max-width: 620px;
    padding: 2rem 1.5rem 4rem;
    display: flex; flex-direction: column;
    align-items: center; gap: 2.25rem;
  }

  /* ── 標題 ── */
  .header {
    width: 100%; display: flex;
    flex-direction: column; align-items: center; gap: 1rem;
  }

  .back-link {
    align-self: flex-start; color: #92400e;
    font-size: 0.875rem; text-decoration: none;
    letter-spacing: 0.03em; transition: color 0.2s;
  }
  .back-link:hover { color: #ca8a04; }

  .title-block { text-align: center; }

  .title-deco {
    display: flex; align-items: center;
    gap: 0.65rem; justify-content: center; margin-bottom: 0.6rem;
  }
  .title-deco-sm { margin-top: 0.65rem; margin-bottom: 0; }

  .deco-line {
    display: block; width: 44px; height: 1px;
    background: linear-gradient(90deg, transparent, #7C2D12, transparent);
  }
  .deco-diamond { color: #7C2D12; font-size: 0.45rem; }
  .deco-text {
    color: #57534e; font-size: 0.7rem;
    letter-spacing: 0.14em; font-family: 'Noto Serif TC', serif;
  }

  .main-title {
    font-size: 4.25rem; font-weight: 700; color: #FCD34D;
    letter-spacing: 0.18em; line-height: 1;
    font-family: 'Noto Serif TC', serif;
    text-shadow: 0 0 30px rgba(251,191,36,0.35), 0 0 80px rgba(251,191,36,0.12);
  }

  .main-subtitle {
    color: #57534e; font-size: 0.88rem; margin-top: 0.35rem;
    letter-spacing: 0.1em; font-family: 'Noto Serif TC', serif;
  }

  /* ── 祈求欄 ── */
  .prayer-section { width: 100%; display: flex; flex-direction: column; gap: 0.5rem; }

  .prayer-label {
    text-align: center; color: #78350f;
    font-size: 0.78rem; letter-spacing: 0.07em;
    font-family: 'Noto Serif TC', serif;
  }

  .prayer-input {
    width: 100%; background: rgba(18,6,2,0.7);
    border: 1px solid rgba(124,45,18,0.35); border-radius: 0.625rem;
    padding: 0.8rem 1rem; color: #d6d3d1;
    font-size: 0.9rem; font-family: 'Noto Sans TC', sans-serif;
    resize: none; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .prayer-input:focus {
    border-color: rgba(180,83,9,0.55);
    box-shadow: 0 0 0 3px rgba(180,83,9,0.08);
  }
  .prayer-input::placeholder { color: #3a322e; }

  /* ── 筊杯展示 ── */
  .blocks-area {
    display: flex; align-items: flex-end;
    gap: 2.5rem; justify-content: center; padding: 0.5rem 0;
  }

  .block-container {
    display: flex; flex-direction: column;
    align-items: center; gap: 0.65rem;
  }

  .block-wrapper {
    width: 168px; height: 140px;
    display: flex; align-items: flex-end; justify-content: center;
  }

  .block-wrapper.animating { animation: poe-flip 1.1s ease-in-out; }
  .block-wrapper.animating-delay { animation-delay: 0.08s; }

  /* ── 筊杯 SVG ── */
  .poe-svg { width: 164px; height: 108px; transition: transform 0.3s; }

  .poe-dim {
    opacity: 0.35;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
  }

  .poe-yang {
    filter:
      drop-shadow(0 6px 16px rgba(0,0,0,0.7))
      drop-shadow(0 0 18px rgba(200,24,24,0.55));
  }

  .poe-yin {
    filter:
      drop-shadow(0 6px 16px rgba(0,0,0,0.7))
      drop-shadow(0 0 18px rgba(200,24,24,0.50));
  }

  .poe-li {
    filter:
      drop-shadow(0 6px 16px rgba(0,0,0,0.7))
      drop-shadow(0 0 26px rgba(251,191,36,0.75));
    animation: li-glow 1s ease-in-out infinite alternate;
  }

  @keyframes li-glow {
    from { filter: drop-shadow(0 6px 16px rgba(0,0,0,0.7)) drop-shadow(0 0 14px rgba(251,191,36,0.52)); }
    to   { filter: drop-shadow(0 6px 16px rgba(0,0,0,0.7)) drop-shadow(0 0 34px rgba(251,191,36,0.92)); }
  }

  @keyframes poe-flip {
    0%   { transform: translateY(0)     rotate(0deg); }
    20%  { transform: translateY(-72px)  rotate(200deg); }
    45%  { transform: translateY(-100px) rotate(372deg); }
    70%  { transform: translateY(-46px)  rotate(472deg); }
    85%  { transform: translateY(-14px)  rotate(532deg); }
    100% { transform: translateY(0)     rotate(540deg); }
  }

  .block-label {
    font-size: 0.8rem; letter-spacing: 0.06em;
    font-weight: 600; font-family: 'Noto Serif TC', serif;
  }
  .yang-label { color: #f87171; }
  .yin-label  { color: #c07830; }
  .li-label   { color: #FCD34D; font-weight: 700; animation: li-pulse 0.85s ease-in-out infinite alternate; }

  @keyframes li-pulse {
    from { opacity: 0.8; }
    to   { opacity: 1; text-shadow: 0 0 10px rgba(251,191,36,0.9); }
  }

  .divider-icon { color: #3C2A12; font-size: 0.95rem; padding-bottom: 2.5rem; }

  /* ── 擲杯按鈕 ── */
  .throw-btn {
    position: relative; overflow: hidden;
    padding: 0.9rem 3.5rem;
    font-size: 1.3rem; font-weight: 700;
    font-family: 'Noto Serif TC', serif; letter-spacing: 0.2em;
    color: #1C0800;
    background: linear-gradient(135deg, #FDE68A 0%, #F59E0B 45%, #B45309 100%);
    border: none; border-radius: 9999px; cursor: pointer;
    transition: all 0.25s; display: flex; align-items: center; gap: 0.5rem;
    box-shadow:
      0 4px 22px rgba(251,191,36,0.35),
      0 0 0 1px rgba(251,191,36,0.18),
      inset 0 1px 0 rgba(255,255,255,0.2),
      inset 0 -1px 0 rgba(0,0,0,0.15);
  }
  .throw-btn::before {
    content: ''; position: absolute; top: 0; left: -70%;
    width: 45%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
    transform: skewX(-20deg); transition: left 0.55s ease; pointer-events: none;
  }
  .throw-btn:hover:not(:disabled)::before { left: 160%; }
  .throw-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 8px 32px rgba(251,191,36,0.48), 0 0 0 1px rgba(251,191,36,0.28),
      inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15);
  }
  .throw-btn:active:not(:disabled) { transform: translateY(0); }
  .throw-btn:disabled { opacity: 0.65; cursor: default; }

  .btn-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(28,8,0,0.3); border-top-color: #1C0800;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── 結果卡片 ── */
  .result-card {
    width: 100%; border-radius: 1rem; padding: 2px;
    animation: result-appear 0.42s ease-out;
  }
  .result-inner { border-radius: 0.875rem; padding: 1.85rem 1.75rem; text-align: center; }

  @keyframes result-appear {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .result-li {
    background: linear-gradient(135deg, rgba(251,191,36,0.28) 0%, rgba(251,191,36,0.08) 100%);
    border: 1px solid rgba(251,191,36,0.55);
    animation: result-appear 0.42s ease-out, li-card-glow 1.6s ease-in-out infinite alternate;
  }
  .result-li .result-inner  { background: rgba(28,15,2,0.55); }
  .result-li .result-name   { color: #FCD34D; text-shadow: 0 0 24px rgba(251,191,36,0.55); }
  .result-li .result-subtitle { color: #D97706; }
  .result-li .result-note   { color: rgba(251,191,36,0.5); }

  @keyframes li-card-glow {
    from { box-shadow: 0 0 24px rgba(251,191,36,0.08); }
    to   { box-shadow: 0 0 60px rgba(251,191,36,0.22); }
  }

  .result-sheng {
    background: linear-gradient(135deg, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.04) 100%);
    border: 1px solid rgba(16,185,129,0.3);
  }
  .result-sheng .result-inner    { background: rgba(2,18,12,0.5); }
  .result-sheng .result-name     { color: #34d399; }
  .result-sheng .result-subtitle { color: #6ee7b7; }
  .result-sheng .result-note     { color: rgba(52,211,153,0.5); }

  .result-yin {
    background: linear-gradient(135deg, rgba(87,83,78,0.18) 0%, rgba(87,83,78,0.05) 100%);
    border: 1px solid rgba(87,83,78,0.35);
  }
  .result-yin .result-inner    { background: rgba(12,10,9,0.55); }
  .result-yin .result-name     { color: #9ca3af; }
  .result-yin .result-subtitle { color: #6b7280; }
  .result-yin .result-note     { color: rgba(156,163,175,0.45); }

  .result-xiao {
    background: linear-gradient(135deg, rgba(217,119,6,0.18) 0%, rgba(217,119,6,0.05) 100%);
    border: 1px solid rgba(217,119,6,0.35);
  }
  .result-xiao .result-inner    { background: rgba(18,10,2,0.5); }
  .result-xiao .result-name     { color: #fbbf24; }
  .result-xiao .result-subtitle { color: #d97706; }
  .result-xiao .result-note     { color: rgba(251,191,36,0.45); }

  .result-name {
    font-size: 2.6rem; font-weight: 700;
    font-family: 'Noto Serif TC', serif; letter-spacing: 0.14em;
    line-height: 1; margin-bottom: 0.35rem;
  }
  .result-subtitle {
    font-size: 0.88rem; letter-spacing: 0.1em; margin-bottom: 1.1rem;
    font-family: 'Noto Serif TC', serif;
  }
  .result-message { color: #c4c0bc; font-size: 0.94rem; line-height: 1.9; margin-bottom: 0.9rem; }
  .result-note    { font-size: 0.7rem; letter-spacing: 0.06em; }

  .placeholder-text {
    color: #3a322e; font-size: 0.88rem; letter-spacing: 0.1em;
    text-align: center; padding: 0.75rem 0;
    font-family: 'Noto Serif TC', serif;
  }

  /* ── 區塊標題 ── */
  .section-title {
    display: flex; align-items: center; gap: 0.75rem;
    justify-content: center; color: #4a4540;
    font-size: 0.7rem; letter-spacing: 0.2em;
    margin-bottom: 1.25rem; text-transform: uppercase;
    font-family: 'Noto Serif TC', serif; white-space: nowrap;
  }
  .section-line { display: block; flex: 1; max-width: 55px; height: 1px; }
  .section-title .section-line:first-child  { background: linear-gradient(90deg, transparent, rgba(100,75,40,0.45)); }
  .section-title .section-line:last-child   { background: linear-gradient(90deg, rgba(100,75,40,0.45), transparent); }

  /* ── 說明區 ── */
  .guide-section { width: 100%; padding-top: 2rem; border-top: 1px solid rgba(68,55,40,0.22); }

  .guide-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.75rem; margin-bottom: 0.75rem; }

  .guide-item {
    text-align: center; padding: 1rem 0.5rem;
    border-radius: 0.625rem; border: 1px solid transparent; transition: transform 0.2s;
  }
  .guide-item:hover { transform: translateY(-2px); }

  .guide-icon { font-size: 1.3rem; font-family: 'Noto Serif TC', serif; font-weight: 700; margin-bottom: 0.3rem; opacity: 0.88; }

  .guide-sheng { background: rgba(6,78,59,0.15); border-color: rgba(16,185,129,0.22); }
  .guide-sheng .guide-icon, .guide-sheng .guide-name { color: #34d399; }

  .guide-yin { background: rgba(25,22,20,0.4); border-color: rgba(87,83,78,0.25); }
  .guide-yin .guide-icon, .guide-yin .guide-name { color: #9ca3af; }

  .guide-xiao { background: rgba(120,53,15,0.15); border-color: rgba(217,119,6,0.22); }
  .guide-xiao .guide-icon, .guide-xiao .guide-name { color: #fbbf24; }

  .guide-li { background: rgba(48,30,2,0.32); border-color: rgba(251,191,36,0.32); }
  .guide-li .guide-icon, .guide-li .guide-name { color: #FCD34D; }
  .guide-li .guide-desc    { color: #665e50; }
  .guide-li .guide-meaning { color: #78430C; }

  .guide-li-full { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1.25rem; text-align: left; }
  .guide-li-icon { font-size: 1.6rem; min-width: 2rem; text-align: center; margin-bottom: 0; }
  .guide-li-body { flex: 1; }

  .guide-name { font-weight: 700; font-size: 0.95rem; letter-spacing: 0.06em; margin-bottom: 0.2rem; font-family: 'Noto Serif TC', serif; }
  .guide-desc    { font-size: 0.72rem; color: #46403a; margin-bottom: 0.2rem; }
  .guide-meaning { font-size: 0.78rem; color: #625850; }

  /* ── 歷史紀錄 ── */
  .history-section { width: 100%; padding-top: 2rem; border-top: 1px solid rgba(68,55,40,0.22); }

  .history-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .history-header .section-title { margin-bottom: 0; }

  .clear-btn {
    font-size: 0.68rem; color: #4a4540; background: none;
    border: 1px solid rgba(87,83,78,0.3); border-radius: 9999px;
    padding: 0.22rem 0.8rem; cursor: pointer; letter-spacing: 0.05em;
    transition: all 0.2s; white-space: nowrap;
  }
  .clear-btn:hover { color: #9ca3af; border-color: rgba(156,163,175,0.4); }

  .history-empty { text-align: center; color: #2e2926; font-size: 0.85rem; padding: 1.5rem 0; letter-spacing: 0.06em; font-family: 'Noto Serif TC', serif; }

  .history-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }

  .history-entry {
    display: flex; flex-direction: column; gap: 0.25rem;
    padding: 0.75rem 1rem; border-radius: 0.5rem;
    border-left: 2px solid transparent;
    background: rgba(14,9,6,0.55);
    animation: entry-appear 0.3s ease-out;
  }
  @keyframes entry-appear {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .history-entry-li    { border-left-color: rgba(251,191,36,0.75); box-shadow: inset 0 0 20px rgba(251,191,36,0.04); }
  .history-entry-sheng { border-left-color: rgba(52,211,153,0.45); }
  .history-entry-yin   { border-left-color: rgba(107,114,128,0.35); }
  .history-entry-xiao  { border-left-color: rgba(251,191,36,0.4); }

  .entry-meta { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; }
  .entry-time { font-size: 0.7rem; color: #38322e; font-variant-numeric: tabular-nums; }
  .entry-prayer { font-size: 0.76rem; color: #655e56; font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 240px; }

  .entry-result-row { display: flex; align-items: center; gap: 0.5rem; }
  .entry-blocks     { display: flex; align-items: center; gap: 0.25rem; }
  .entry-sep        { color: #222020; font-size: 0.7rem; }

  .mini-block { font-size: 0.7rem; font-weight: 700; padding: 0.1rem 0.35rem; border-radius: 0.25rem; letter-spacing: 0.03em; font-family: 'Noto Serif TC', serif; }
  .mini-yang { color: #ef4444; background: rgba(220,38,38,0.1); }
  .mini-yin  { color: #b45309; background: rgba(146,64,14,0.12); }
  .mini-li   { color: #fbbf24; background: rgba(251,191,36,0.12); }

  .entry-arrow { color: #2e2926; font-size: 0.72rem; }

  .entry-result { font-size: 0.85rem; font-weight: 700; font-family: 'Noto Serif TC', serif; letter-spacing: 0.06em; }
  .entry-result-li    { color: #fbbf24; text-shadow: 0 0 8px rgba(251,191,36,0.45); }
  .entry-result-sheng { color: #34d399; }
  .entry-result-yin   { color: #6b7280; }
  .entry-result-xiao  { color: #d97706; }
</style>
