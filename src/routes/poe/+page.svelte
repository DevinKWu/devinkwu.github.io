<svelte:head>
  <title>擲杯占卜 | Devin Wu</title>
  <meta name="description" content="傳統台灣廟宇筊杯問卜儀式模擬">
</svelte:head>

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

<div class="poe-page">
  <!-- 背景裝飾 -->
  <div class="bg-decor" aria-hidden="true">
    <div class="bg-decor-circle bg-decor-circle-1"></div>
    <div class="bg-decor-circle bg-decor-circle-2"></div>
  </div>

  <div class="content-wrapper">
    <!-- 標題區 -->
    <header class="header">
      <a href="/" class="back-link">← 回首頁</a>
      <div class="title-block">
        <h1 class="main-title">擲杯</h1>
        <p class="main-subtitle">傳統台灣廟宇問卜儀式</p>
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
            <svg class="poe-svg dim" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="82" rx="50" ry="7" fill="rgba(0,0,0,0.25)"/>
              <path d="M 10,72 A 50,62 0 0,1 110,72 L 110,78 Q 60,84 10,78 Z" fill="#4B2020"/>
              <path d="M 10,72 A 50,62 0 0,1 110,72" fill="#6B2020"/>
              <path d="M 30,50 A 28,32 0 0,1 90,50" fill="none" stroke="#7f3030" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
            </svg>
          {:else if block1 === 0}
            <!-- 陽面：紅色弓形，弧面朝上 -->
            <svg class="poe-svg yang" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="82" rx="50" ry="7" fill="rgba(120,20,20,0.4)"/>
              <path d="M 10,72 A 50,62 0 0,1 110,72 L 110,78 Q 60,86 10,78 Z" fill="#991B1B"/>
              <path d="M 10,72 A 50,62 0 0,1 110,72" fill="#DC2626"/>
              <path d="M 28,48 A 30,36 0 0,1 92,48" fill="none" stroke="#FCA5A5" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
              <ellipse cx="60" cy="60" rx="18" ry="10" fill="#EF4444" opacity="0.3"/>
              <text x="60" y="67" text-anchor="middle" fill="#7F1D1D" font-size="15" font-family="Noto Sans TC, serif" font-weight="bold">陽</text>
            </svg>
          {:else if block1 === 1}
            <!-- 陰面：木褐色，平面朝上（較平緩） -->
            <svg class="poe-svg yin" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="82" rx="50" ry="7" fill="rgba(60,30,10,0.4)"/>
              <path d="M 10,72 A 50,38 0 0,1 110,72 L 110,78 Q 60,86 10,78 Z" fill="#78350F"/>
              <path d="M 10,72 A 50,38 0 0,1 110,72" fill="#92400E"/>
              <ellipse cx="60" cy="68" rx="30" ry="8" fill="#6B2D0B" opacity="0.55"/>
              <path d="M 25,66 A 35,24 0 0,0 95,66" fill="none" stroke="#B45309" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
              <text x="60" y="71" text-anchor="middle" fill="#D97706" font-size="15" font-family="Noto Sans TC, serif" font-weight="bold">陰</text>
            </svg>
          {:else}
            <!-- 立面：直立不倒，神蹟 -->
            <svg class="poe-svg li" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="84" rx="12" ry="3.5" fill="rgba(251,191,36,0.4)"/>
              <path d="M 57,18 C 67,32 68,57 59,78 C 52,62 51,36 57,18 Z" fill="#7c2d12"/>
              <path d="M 57,18 C 63,35 63,60 59,78" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
              <g opacity="0.6" stroke="#fbbf24" stroke-width="1.3" stroke-linecap="round">
                <line x1="59" y1="13" x2="59" y2="6"/>
                <line x1="65" y1="15" x2="69" y2="9"/>
                <line x1="53" y1="15" x2="49" y2="9"/>
                <line x1="69" y1="22" x2="74" y2="17"/>
                <line x1="49" y1="22" x2="44" y2="17"/>
              </g>
              <text x="61" y="55" text-anchor="middle" fill="#fbbf24" font-size="14" font-family="Noto Sans TC, serif" font-weight="bold">立</text>
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

      <!-- 筊杯 2 -->
      <div class="block-container">
        <div class="block-wrapper {isAnimating ? 'animating animating-delay' : ''}">
          {#if block2 === null}
            <svg class="poe-svg dim" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="82" rx="50" ry="7" fill="rgba(0,0,0,0.25)"/>
              <path d="M 10,72 A 50,62 0 0,1 110,72 L 110,78 Q 60,84 10,78 Z" fill="#4B2020"/>
              <path d="M 10,72 A 50,62 0 0,1 110,72" fill="#6B2020"/>
              <path d="M 30,50 A 28,32 0 0,1 90,50" fill="none" stroke="#7f3030" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
            </svg>
          {:else if block2 === 0}
            <svg class="poe-svg yang" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="82" rx="50" ry="7" fill="rgba(120,20,20,0.4)"/>
              <path d="M 10,72 A 50,62 0 0,1 110,72 L 110,78 Q 60,86 10,78 Z" fill="#991B1B"/>
              <path d="M 10,72 A 50,62 0 0,1 110,72" fill="#DC2626"/>
              <path d="M 28,48 A 30,36 0 0,1 92,48" fill="none" stroke="#FCA5A5" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
              <ellipse cx="60" cy="60" rx="18" ry="10" fill="#EF4444" opacity="0.3"/>
              <text x="60" y="67" text-anchor="middle" fill="#7F1D1D" font-size="15" font-family="Noto Sans TC, serif" font-weight="bold">陽</text>
            </svg>
          {:else if block2 === 1}
            <svg class="poe-svg yin" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="82" rx="50" ry="7" fill="rgba(60,30,10,0.4)"/>
              <path d="M 10,72 A 50,38 0 0,1 110,72 L 110,78 Q 60,86 10,78 Z" fill="#78350F"/>
              <path d="M 10,72 A 50,38 0 0,1 110,72" fill="#92400E"/>
              <ellipse cx="60" cy="68" rx="30" ry="8" fill="#6B2D0B" opacity="0.55"/>
              <path d="M 25,66 A 35,24 0 0,0 95,66" fill="none" stroke="#B45309" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
              <text x="60" y="71" text-anchor="middle" fill="#D97706" font-size="15" font-family="Noto Sans TC, serif" font-weight="bold">陰</text>
            </svg>
          {:else}
            <!-- 立面：直立不倒，神蹟 -->
            <svg class="poe-svg li" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="84" rx="12" ry="3.5" fill="rgba(251,191,36,0.4)"/>
              <path d="M 57,18 C 67,32 68,57 59,78 C 52,62 51,36 57,18 Z" fill="#7c2d12"/>
              <path d="M 57,18 C 63,35 63,60 59,78" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
              <g opacity="0.6" stroke="#fbbf24" stroke-width="1.3" stroke-linecap="round">
                <line x1="59" y1="13" x2="59" y2="6"/>
                <line x1="65" y1="15" x2="69" y2="9"/>
                <line x1="53" y1="15" x2="49" y2="9"/>
                <line x1="69" y1="22" x2="74" y2="17"/>
                <line x1="49" y1="22" x2="44" y2="17"/>
              </g>
              <text x="61" y="55" text-anchor="middle" fill="#fbbf24" font-size="14" font-family="Noto Sans TC, serif" font-weight="bold">立</text>
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
        <div class="result-name">{resultInfo.name}</div>
        <div class="result-subtitle">{resultInfo.subtitle}</div>
        <p class="result-message">{resultInfo.message}</p>
        <div class="result-note">{resultInfo.note}</div>
      </div>
    {:else if !hasThrown}
      <div class="placeholder-text">誠心默念，點擊擲杯</div>
    {/if}

    <!-- 說明區 -->
    <div class="guide-section">
      <h2 class="guide-title">擲杯說明</h2>
      <div class="guide-grid">
        <div class="guide-item guide-sheng">
          <div class="guide-item-name">聖杯</div>
          <div class="guide-item-desc">一陽一陰</div>
          <div class="guide-item-meaning">神明允許</div>
        </div>
        <div class="guide-item guide-yin">
          <div class="guide-item-name">陰杯</div>
          <div class="guide-item-desc">兩個平面</div>
          <div class="guide-item-meaning">神明不允</div>
        </div>
        <div class="guide-item guide-xiao">
          <div class="guide-item-name">笑杯</div>
          <div class="guide-item-desc">兩個弧面</div>
          <div class="guide-item-meaning">再擲一次</div>
        </div>
      </div>
      <div class="guide-item guide-li guide-li-full">
        <div class="guide-item-name">立杯</div>
        <div class="guide-item-desc">筊杯直立不倒，9007兆分之一</div>
        <div class="guide-item-meaning">神蹟顯現，極為罕見</div>
      </div>
    </div>

    <!-- 歷史紀錄 -->
    <div class="history-section">
      <div class="history-header">
        <h2 class="history-title">擲杯紀錄</h2>
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
                  <span class="entry-blocks-sep">·</span>
                  <span class="mini-block {entry.block2 === 0 ? 'mini-yang' : entry.block2 === 1 ? 'mini-yin' : 'mini-li'}">
                    {entry.block2 === 0 ? '陽' : entry.block2 === 1 ? '陰' : '立'}
                  </span>
                </div>
                <span class="entry-arrow">→</span>
                <span class="entry-result-name entry-result-{entry.result}">
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
  .poe-page {
    min-height: calc(100vh - 4rem);
    background: #0a0608;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  .bg-decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .bg-decor-circle {
    position: absolute;
    border-radius: 9999px;
    filter: blur(80px);
    opacity: 0.12;
  }

  .bg-decor-circle-1 {
    width: 600px;
    height: 600px;
    background: #7f1d1d;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
  }

  .bg-decor-circle-2 {
    width: 400px;
    height: 400px;
    background: #78350f;
    bottom: 0;
    right: -100px;
  }

  .content-wrapper {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 600px;
    padding: 2rem 1.5rem 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .back-link {
    align-self: flex-start;
    color: #a16207;
    font-size: 0.875rem;
    text-decoration: none;
    transition: color 0.2s;
  }
  .back-link:hover {
    color: #ca8a04;
  }

  .title-block {
    text-align: center;
  }

  .main-title {
    font-size: 3.5rem;
    font-weight: 700;
    color: #fbbf24;
    letter-spacing: 0.1em;
    line-height: 1.1;
    font-family: 'Noto Sans TC', serif;
    text-shadow: 0 0 40px rgba(251, 191, 36, 0.3);
  }

  .main-subtitle {
    color: #6b7280;
    font-size: 0.95rem;
    margin-top: 0.25rem;
    letter-spacing: 0.05em;
  }

  .prayer-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .prayer-label {
    text-align: center;
    color: #92400e;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }

  .prayer-input {
    width: 100%;
    background: rgba(30, 10, 5, 0.6);
    border: 1px solid rgba(120, 53, 15, 0.4);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    color: #d6d3d1;
    font-size: 0.9rem;
    font-family: 'Noto Sans TC', sans-serif;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
  }

  .prayer-input:focus {
    border-color: rgba(180, 83, 9, 0.6);
  }

  .prayer-input::placeholder {
    color: #44403c;
  }

  .blocks-area {
    display: flex;
    align-items: flex-end;
    gap: 2rem;
    justify-content: center;
    padding: 1rem 0;
  }

  .block-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .block-wrapper {
    width: 130px;
    height: 100px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .block-wrapper.animating {
    animation: poe-flip 1.1s ease-in-out;
  }

  .block-wrapper.animating-delay {
    animation-delay: 0.08s;
  }

  .poe-svg {
    width: 120px;
    height: 90px;
    transition: transform 0.3s;
  }

  .poe-svg.dim {
    opacity: 0.4;
  }

  .poe-svg.yang {
    filter: drop-shadow(0 0 12px rgba(220, 38, 38, 0.5));
  }

  .poe-svg.yin {
    filter: drop-shadow(0 0 8px rgba(146, 64, 14, 0.4));
  }

  .poe-svg.li {
    filter: drop-shadow(0 0 16px rgba(251, 191, 36, 0.75));
    animation: li-glow 1s ease-in-out infinite alternate;
  }

  @keyframes li-glow {
    from { filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5)); }
    to   { filter: drop-shadow(0 0 22px rgba(251, 191, 36, 0.9)); }
  }

  @keyframes poe-flip {
    0%   { transform: translateY(0) rotate(0deg); }
    20%  { transform: translateY(-60px) rotate(180deg); }
    45%  { transform: translateY(-90px) rotate(360deg); }
    70%  { transform: translateY(-40px) rotate(450deg); }
    85%  { transform: translateY(-10px) rotate(520deg); }
    100% { transform: translateY(0) rotate(540deg); }
  }

  .block-label {
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    font-weight: 500;
  }

  .yang-label { color: #ef4444; }
  .yin-label  { color: #b45309; }
  .li-label   { color: #fbbf24; font-weight: 700; animation: li-pulse 0.8s ease-in-out infinite alternate; }

  @keyframes li-pulse {
    from { opacity: 0.8; }
    to   { opacity: 1; text-shadow: 0 0 8px rgba(251, 191, 36, 0.8); }
  }

  .divider-icon {
    color: #44403c;
    font-size: 1.2rem;
    padding-bottom: 1.5rem;
  }

  .throw-btn {
    padding: 0.875rem 3rem;
    font-size: 1.25rem;
    font-weight: 600;
    font-family: 'Noto Sans TC', sans-serif;
    letter-spacing: 0.15em;
    color: #0a0608;
    background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 24px rgba(251, 191, 36, 0.25);
  }

  .throw-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(251, 191, 36, 0.4);
  }

  .throw-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .throw-btn:disabled {
    opacity: 0.7;
    cursor: default;
  }

  .btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(10, 6, 8, 0.3);
    border-top-color: #0a0608;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .result-card {
    width: 100%;
    border-radius: 1rem;
    padding: 1.75rem;
    text-align: center;
    animation: result-appear 0.4s ease-out;
    border: 1px solid transparent;
  }

  @keyframes result-appear {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .result-li {
    background: rgba(60, 40, 5, 0.4);
    border-color: rgba(251, 191, 36, 0.6);
    box-shadow: 0 0 40px rgba(251, 191, 36, 0.12);
    animation: result-appear 0.4s ease-out, li-card-glow 1.5s ease-in-out infinite alternate;
  }

  @keyframes li-card-glow {
    from { box-shadow: 0 0 20px rgba(251, 191, 36, 0.08); }
    to   { box-shadow: 0 0 50px rgba(251, 191, 36, 0.22); }
  }

  .result-li .result-name { color: #fbbf24; text-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
  .result-li .result-subtitle { color: #d97706; }
  .result-li .result-note { color: #fbbf24; }

  .result-sheng {
    background: rgba(6, 78, 59, 0.25);
    border-color: rgba(16, 185, 129, 0.35);
  }
  .result-yin {
    background: rgba(30, 27, 25, 0.5);
    border-color: rgba(87, 83, 78, 0.4);
  }
  .result-xiao {
    background: rgba(120, 53, 15, 0.25);
    border-color: rgba(217, 119, 6, 0.4);
  }

  .result-name {
    font-size: 2.25rem;
    font-weight: 700;
    font-family: 'Noto Sans TC', serif;
    letter-spacing: 0.1em;
    line-height: 1;
    margin-bottom: 0.25rem;
  }
  .result-sheng .result-name { color: #34d399; }
  .result-yin  .result-name { color: #9ca3af; }
  .result-xiao .result-name { color: #fbbf24; }

  .result-subtitle {
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    margin-bottom: 1rem;
  }
  .result-sheng .result-subtitle { color: #6ee7b7; }
  .result-yin  .result-subtitle { color: #6b7280; }
  .result-xiao .result-subtitle { color: #d97706; }

  .result-message {
    color: #d6d3d1;
    font-size: 0.95rem;
    line-height: 1.75;
    margin-bottom: 0.75rem;
  }

  .result-note {
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    opacity: 0.5;
  }
  .result-sheng .result-note { color: #34d399; }
  .result-yin  .result-note { color: #9ca3af; }
  .result-xiao .result-note { color: #fbbf24; }

  .placeholder-text {
    color: #44403c;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    text-align: center;
    padding: 1rem 0;
  }

  .guide-section {
    width: 100%;
    margin-top: 0.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(68, 64, 60, 0.3);
  }

  .guide-title {
    text-align: center;
    color: #57534e;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  .guide-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .guide-item {
    text-align: center;
    padding: 0.875rem 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
  }

  .guide-li {
    background: rgba(60, 40, 5, 0.3);
    border-color: rgba(251, 191, 36, 0.35);
  }

  .guide-li-full {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    padding: 0.75rem 1rem;
    margin-top: 0.25rem;
  }

  .guide-li-full .guide-item-name {
    margin-bottom: 0;
  }

  .guide-li-full .guide-item-desc,
  .guide-li-full .guide-item-meaning {
    margin-bottom: 0;
  }

  .guide-li .guide-item-name { color: #fbbf24; }
  .guide-li .guide-item-desc { color: #78716c; }
  .guide-li .guide-item-meaning { color: #92400e; }

  .guide-sheng {
    background: rgba(6, 78, 59, 0.15);
    border-color: rgba(16, 185, 129, 0.2);
  }
  .guide-yin {
    background: rgba(30, 27, 25, 0.3);
    border-color: rgba(87, 83, 78, 0.25);
  }
  .guide-xiao {
    background: rgba(120, 53, 15, 0.15);
    border-color: rgba(217, 119, 6, 0.2);
  }

  .guide-item-name {
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.08em;
    margin-bottom: 0.25rem;
    font-family: 'Noto Sans TC', serif;
  }
  .guide-sheng .guide-item-name { color: #34d399; }
  .guide-yin  .guide-item-name { color: #9ca3af; }
  .guide-xiao .guide-item-name { color: #fbbf24; }

  .guide-item-desc {
    font-size: 0.75rem;
    color: #57534e;
    margin-bottom: 0.25rem;
  }

  .guide-item-meaning {
    font-size: 0.8rem;
    color: #78716c;
  }

  /* 歷史紀錄 */
  .history-section {
    width: 100%;
    margin-top: 0.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(68, 64, 60, 0.3);
  }

  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .history-title {
    color: #57534e;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .clear-btn {
    font-size: 0.7rem;
    color: #57534e;
    background: none;
    border: 1px solid rgba(87, 83, 78, 0.35);
    border-radius: 9999px;
    padding: 0.2rem 0.75rem;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: all 0.2s;
  }

  .clear-btn:hover {
    color: #9ca3af;
    border-color: rgba(156, 163, 175, 0.4);
  }

  .history-empty {
    text-align: center;
    color: #3f3c3a;
    font-size: 0.85rem;
    padding: 1.5rem 0;
    letter-spacing: 0.05em;
  }

  .history-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .history-entry {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border-left: 3px solid transparent;
    background: rgba(20, 15, 12, 0.5);
    animation: entry-appear 0.3s ease-out;
  }

  @keyframes entry-appear {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .history-entry-li    { border-left-color: rgba(251, 191, 36, 0.8); box-shadow: inset 0 0 20px rgba(251, 191, 36, 0.05); }
  .history-entry-sheng { border-left-color: rgba(52, 211, 153, 0.5); }
  .history-entry-yin   { border-left-color: rgba(107, 114, 128, 0.4); }
  .history-entry-xiao  { border-left-color: rgba(251, 191, 36, 0.45); }

  .entry-meta {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .entry-time {
    font-size: 0.72rem;
    color: #44403c;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  .entry-prayer {
    font-size: 0.78rem;
    color: #78716c;
    font-style: italic;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 260px;
  }

  .entry-result-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .entry-blocks {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .entry-blocks-sep {
    color: #292524;
    font-size: 0.7rem;
  }

  .mini-block {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.1rem 0.35rem;
    border-radius: 0.25rem;
    letter-spacing: 0.03em;
  }

  .mini-yang {
    color: #ef4444;
    background: rgba(220, 38, 38, 0.12);
  }

  .mini-yin {
    color: #b45309;
    background: rgba(146, 64, 14, 0.15);
  }

  .mini-li {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.15);
    font-weight: 700;
  }

  .entry-arrow {
    color: #3f3c3a;
    font-size: 0.75rem;
  }

  .entry-result-name {
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'Noto Sans TC', serif;
    letter-spacing: 0.06em;
  }

  .entry-result-li    { color: #fbbf24; text-shadow: 0 0 8px rgba(251, 191, 36, 0.5); }
  .entry-result-sheng { color: #34d399; }
  .entry-result-yin   { color: #6b7280; }
  .entry-result-xiao  { color: #fbbf24; }
</style>
