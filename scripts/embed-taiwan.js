import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { client } from "../lib/openai.js"; // 換成與老師相同的初始化客戶端
import { qdrant, EMBEDDING_DIM } from "../lib/qdrant.js";
import crypto from "node:crypto"; // 引入 Node.js 內建的 crypto 來產標準 UUID

const CSV_PATH = "data/taiwan_attractions.csv";
const COLLECTION_NAME = "taiwan_attractions"; // 我們的風景名勝 Collection
const EMBEDDING_MODEL = "text-embedding-3-small";

// 將景點資料轉換成要轉向量的純文字
function rowToText(row) {
  return [row.title, row.description].filter(Boolean).join(" | ");
}

// 建立或重新建立 Collection
async function recreateCollection() {
  const exists = await qdrant.collectionExists(COLLECTION_NAME);
  if (exists.exists) {
    await qdrant.deleteCollection(COLLECTION_NAME);
  }
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: EMBEDDING_DIM, distance: "Cosine" },
  });
}

// 批次生成 Embedding
async function embedBatch(texts) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

async function main() {
  const csv = await readFile(CSV_PATH, "utf8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true });
  console.log(`📂 讀到 ${rows.length} 筆景點資料`);

  await recreateCollection();
  console.log(`ℹ️ 已建立 collection: ${COLLECTION_NAME}`);

  const texts = rows.map(rowToText);
  console.log("⏳ 正在向 OpenAI 請求生成向量定義...");
  const vectors = await embedBatch(texts);

  // 完全仿照老師的對應對象，但將 id 升級為保證相容的標準 UUID 格式
  const points = rows.map((row, idx) => ({
    id: crypto.randomUUID(), // ✅ 使用標準 UUID 格式，避開雲端 API 對數值型 ID 的嚴格格式審查
    vector: vectors[idx],
    payload: {
      title: row.title,
      description: row.description,
    },
  }));

  console.log("🚀 正在寫入 Qdrant 向量資料庫...");
  await qdrant.upsert(COLLECTION_NAME, { wait: true, points });

  console.log("✅ 台灣風景名勝知識庫建立完成！");
}

main().catch((err) => {
  console.error("💥 執行失敗：", err);
  process.exit(1);
});