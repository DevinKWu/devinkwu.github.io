export const HISTORY_LIMIT = 100;

// 穩定且唯一的 id：快速連續新增多個選項時不會碰撞
export function makeId() {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Fisher-Yates；回傳新陣列，不改動來源（確保原清單順序不變）
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 逗號分隔字串 → 去重、去空的標籤陣列
export function parseTags(str) {
  return [...new Set((str ?? '').split(/[,，]/).map(t => t.trim()).filter(Boolean))];
}

// 時間戳 → zh-TW 24 小時格式
export function formatTime(ts) {
  return new Date(ts).toLocaleString('zh-TW', { hour12: false });
}
