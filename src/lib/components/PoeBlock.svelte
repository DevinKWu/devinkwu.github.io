<script>
  // side: 'left' | 'right'
  // block: null | 0（陽）| 1（陰）| 2（立）
  let { block, isAnimating, poeColor, delay = false, side = 'left' } = $props();

  const isLeft = $derived(side === 'left');

  const yangSweep1    = $derived(isLeft ? 0 : 1);
  const yangSweep2    = $derived(isLeft ? 1 : 0);
  const yangShadowCx  = $derived(isLeft ? 51  : 148);
  const yangTextX     = $derived(isLeft ? 50  : 150);

  const yinGradId     = $derived(isLeft ? 'pg-yin-R' : 'pg-yin-L');
  const yinShadowCx   = $derived(isLeft ? 148 : 51);
  const yinTextX      = $derived(isLeft ? 150 : 50);
  const yinHlCx       = $derived(isLeft ? 148 : 51);
  const yinHlRot      = $derived(isLeft ? 5   : -5);
  const yinLinePath   = $derived(isLeft
    ? 'M 112,35 Q 147,27 162,56'
    : 'M 88,35 Q 53,27 38,56');
  const yinOuterPath  = $derived(isLeft
    ? 'M 100,15 A 75,60 0 0 1 100,135'
    : 'M 100,15 A 75,60 0 0 0 100,135');

  const woodGrains = $derived(isLeft
    ? [
        { d: 'M 38,30 Q 55,75 38,120',  w: 0.9, o: 0.06 },
        { d: 'M 50,22 Q 64,75 50,128',  w: 1.0, o: 0.07 },
        { d: 'M 62,20 Q 72,75 62,130',  w: 0.8, o: 0.05 },
      ]
    : [
        { d: 'M 162,30 Q 145,75 162,120', w: 0.9, o: 0.06 },
        { d: 'M 150,22 Q 136,75 150,128', w: 1.0, o: 0.07 },
        { d: 'M 138,20 Q 128,75 138,130', w: 0.8, o: 0.05 },
      ]
  );
  const yangBottomArc = $derived(isLeft
    ? 'M 27,128 A 25,10 0 0 0 78,128'
    : 'M 122,128 A 25,10 0 0 1 173,128');
</script>

<div class="flex flex-col items-center gap-2.5">
  <div class="block-wrapper {isAnimating ? `animating${delay ? ' animating-delay' : ''}` : ''}">

    {#if block === null}
      <svg class="poe-svg poe-dim" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx={yangShadowCx} cy="142" rx="25" ry="4" fill="rgba(0,0,0,0.06)"/>
        <path d="M 100,15 A 75,60 0 0 {yangSweep1} 100,135 A 22,60 0 0 {yangSweep2} 100,15 Z" fill="#d4a0a0"/>
        <path d="M 100,15 A 75,60 0 0 {yangSweep1} 100,135 A 22,60 0 0 {yangSweep2} 100,15 Z" fill="none" stroke="#b08080" stroke-width="1.5"/>
      </svg>

    {:else if block === 0}
      <svg class="poe-svg poe-yang" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx={yangShadowCx} cy="142" rx="25" ry="4" fill="rgba(0,0,0,0.12)"/>
        <path d="M 100,15 A 75,60 0 0 {yangSweep1} 100,135 A 22,60 0 0 {yangSweep2} 100,15 Z" fill="url(#pg-yang)"/>
        {#each woodGrains as g}
          <path d={g.d} stroke="rgba(0,0,0,{g.o})" stroke-width={g.w} fill="none" stroke-linecap="round"/>
        {/each}
        <path d={yangBottomArc} stroke="rgba(0,0,0,0.16)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 100,15 A 75,60 0 0 {yangSweep1} 100,135 A 22,60 0 0 {yangSweep2} 100,15 Z" fill="none" stroke="rgba(20,0,0,0.22)" stroke-width="1.5"/>
        <text x={yangTextX} y="80" text-anchor="middle"
              fill="white" font-size="18"
              font-family="'Noto Serif TC',serif" font-weight="bold"
              letter-spacing="2"
              stroke={poeColor.rim} stroke-width="3" paint-order="stroke">陽</text>
      </svg>

    {:else if block === 1}
      <svg class="poe-svg poe-yin" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx={yinShadowCx} cy="142" rx="25" ry="4" fill="rgba(0,0,0,0.12)"/>
        <path d="M 100,15 A 75,60 0 0 {yangSweep1 === 0 ? 1 : 0} 100,135 A 22,60 0 0 {yangSweep1} 100,15 Z" fill="url(#{yinGradId})"/>
        <ellipse cx={yinHlCx} cy="44" rx="20" ry="28" fill="url(#pg-spec)" opacity="0.85" transform="rotate({yinHlRot},{yinHlCx},44)"/>
        <path d={yinLinePath} fill="none" stroke="rgba(255,235,235,0.68)" stroke-width="3.2" stroke-linecap="round"/>
        <path d={yinOuterPath} fill="none" stroke="rgba(20,0,0,0.28)" stroke-width="1.5"/>
        <text x={yinTextX} y="80" text-anchor="middle"
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

  {#if !isAnimating && block !== null}
    <span class="block-label {block === 0 ? 'yang-label' : block === 1 ? 'yin-label' : 'li-label'}">
      {block === 0 ? '陽面' : block === 1 ? '陰面' : '立！'}
    </span>
  {/if}
</div>

<style>
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
</style>
