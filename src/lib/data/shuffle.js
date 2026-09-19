export const HISTORY_LIMIT = 100;

let wasmPromise = null;

function loadShuffleWasm() {
  if (!wasmPromise) {
    wasmPromise = import('$lib/wasm/rust-shuffle/rust_shuffle.js')
      .then(async (module) => {
        await module.default();
        return module;
      })
      .catch((error) => {
        wasmPromise = null;
        throw error;
      });
  }

  return wasmPromise;
}

export async function preloadShuffleWasm() {
  await loadShuffleWasm();
}

// 穩定且唯一的 id：快速連續新增多個選項時不會碰撞
export function makeId() {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Fisher-Yates 實作位於 rust-shuffle WASM；回傳新陣列，不改動來源。
export async function shuffle(arr) {
  const { shuffleOptions } = await loadShuffleWasm();
  return shuffleOptions(arr);
}

// 逗號分隔字串 → 去重、去空的標籤陣列；核心邏輯由 rust-shuffle WASM 提供。
export async function parseTags(str) {
  const { parseTags: parseTagsWasm } = await loadShuffleWasm();
  return parseTagsWasm(str ?? '');
}

// 時間戳 → zh-TW 24 小時格式
export function formatTime(ts) {
  return new Date(ts).toLocaleString('zh-TW', { hour12: false });
}
