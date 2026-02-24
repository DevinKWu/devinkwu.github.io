// N 超過此值時不渲染逐筆清單（避免大量 DOM 節點卡頓）
export const DETAIL_LIMIT = 50;

// 筊杯顏色預設（三個固定 + 一個自訂）
export const poeColorPresets = [
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

export const resultMap = {
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

// HSL 色彩轉換（無須外部 lib）
export function hexToHsl(hex) {
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

export function hslToHex(h, s, l) {
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

export function makeColorFromHex(hex) {
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

export function computeStats(throws) {
  return throws.reduce((acc, t) => {
    acc[t.res] = (acc[t.res] || 0) + 1;
    return acc;
  }, {});
}

export function computeStreaks(throws) {
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
