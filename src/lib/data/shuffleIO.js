// 選項清單匯入/匯出輔助：JSON / CSV / XLSX / YAML
import { makeId, parseTags } from './shuffle.js';

// csv/xlsx 的欄位順序
const COLUMNS = ['id', 'title', 'note', 'tags', 'createdAt', 'updatedAt'];

export const FORMAT_META = {
  json: { ext: 'json', mime: 'application/json',                                                            clipboard: true,  label: 'JSON' },
  csv:  { ext: 'csv',  mime: 'text/csv',                                                                    clipboard: true,  label: 'CSV' },
  xlsx: { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',           clipboard: false, label: 'XLSX' },
  yml:  { ext: 'yml',  mime: 'text/yaml',                                                                    clipboard: true,  label: 'YAML' },
};

// 動態載入第三方套件（避免進入預渲染路徑、並做 CJS/ESM interop）
async function loadYaml() {
  const mod = await import('js-yaml');
  return mod.dump ? mod : mod.default;
}
async function loadXlsx() {
  const mod = await import('xlsx');
  return mod.utils ? mod : mod.default;
}

function toTs(v) {
  if (typeof v === 'number' && isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const s = v.trim();
    if (/^\d+$/.test(s)) return Number(s);
    const t = Date.parse(s);
    if (!isNaN(t)) return t;
  }
  return null;
}

// 內部選項 → 扁平列（給 csv/xlsx，時間用 ISO、標籤用逗號串接）
function toRow(o) {
  return {
    id: o.id,
    title: o.title,
    note: o.note,
    tags: o.tags.join(', '),
    createdAt: new Date(o.createdAt).toISOString(),
    updatedAt: new Date(o.updatedAt).toISOString(),
  };
}

// 正規化任意來源記錄 → 內部選項；title 空則回傳 null（略過）
function normalizeRecord(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const title = String(raw.title ?? raw.Title ?? '').trim();
  if (title === '') return null;
  const note = String(raw.note ?? raw.Note ?? '').trim();
  let tags;
  if (Array.isArray(raw.tags)) tags = raw.tags.map(t => String(t).trim()).filter(Boolean);
  else tags = parseTags(String(raw.tags ?? raw.Tags ?? ''));
  tags = [...new Set(tags)];
  const createdAt = toTs(raw.createdAt) ?? Date.now();
  const updatedAt = toTs(raw.updatedAt) ?? createdAt;
  const id = (typeof raw.id === 'string' && raw.id) ? raw.id
           : (raw.id != null ? String(raw.id) : makeId());
  return { id, title, note, tags, createdAt, updatedAt };
}

// 正規化陣列；檔案內 id 重複時補新 id
function normalizeList(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of arr) {
    const o = normalizeRecord(raw);
    if (!o) continue;
    if (seen.has(o.id)) o.id = makeId();
    seen.add(o.id);
    out.push(o);
  }
  return out;
}

// === 匯出 ===
// 文字格式（json/csv/yml）回傳字串；xlsx 回傳 Uint8Array
export async function serialize(options, format) {
  switch (format) {
    case 'json':
      return JSON.stringify(options, null, 2);
    case 'yml': {
      const yaml = await loadYaml();
      return yaml.dump(options);
    }
    case 'csv': {
      const XLSX = await loadXlsx();
      const ws = XLSX.utils.json_to_sheet(options.map(toRow), { header: COLUMNS });
      return XLSX.utils.sheet_to_csv(ws);
    }
    case 'xlsx': {
      const XLSX = await loadXlsx();
      const ws = XLSX.utils.json_to_sheet(options.map(toRow), { header: COLUMNS });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'options');
      return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    }
    default:
      throw new Error(`不支援的格式：${format}`);
  }
}

// === 匯入 ===
// content：文字格式為 string；xlsx 為 Uint8Array
export async function deserialize(content, format) {
  switch (format) {
    case 'json':
      return normalizeList(JSON.parse(content));
    case 'yml': {
      const yaml = await loadYaml();
      return normalizeList(yaml.load(content));
    }
    case 'csv': {
      const XLSX = await loadXlsx();
      const wb = XLSX.read(content, { type: 'string' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      return normalizeList(XLSX.utils.sheet_to_json(ws, { defval: '' }));
    }
    case 'xlsx': {
      const XLSX = await loadXlsx();
      const wb = XLSX.read(content, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      return normalizeList(XLSX.utils.sheet_to_json(ws, { defval: '' }));
    }
    default:
      throw new Error(`不支援的格式：${format}`);
  }
}
