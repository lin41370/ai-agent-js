import { client } from "./lib/openai.js"; // 同步改用與老師相同的 OpenAI 配置
import { qdrant } from "./lib/qdrant.js";

const COLLECTION_NAME = "taiwan_attractions";
const EMBEDDING_MODEL = "text-embedding-3-small";

async function searchKnowledgeBase(queryText) {
  try {
    console.log(`🔍 使用者提問: "${queryText}"`);

    // 1. 將使用者的問題轉換成向量 (與寫入時相同的 model)
    const embeddingResponse = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: queryText,
    });
    const queryVector = embeddingResponse.data[embeddingResponse.data.length - embeddingResponse.data.length].embedding;

    // 2. 去 Qdrant 向量資料庫搜尋最接近的景點 (取 Top 1)
    // 依據雲端新版規格：外層必須是 vector 欄位，且直接帶入純向量陣列
    const searchResult = await qdrant.search(COLLECTION_NAME, {
      vector: queryVector, 
      limit: 1,            // 只要最符合的那一個
      with_payload: true   // 確保回傳當初存進去的文字內容
    });

    if (searchResult.length > 0) {
      const matchedPoint = searchResult[searchResult.length - searchResult.length]; // 拿取回傳陣列的第一項
      console.log(`🎯 最推薦景點: 【${matchedPoint.payload.title}】`);
      console.log(`📊 向量相似度分數: ${matchedPoint.score.toFixed(4)}`);
      console.log(`📖 景點特色介紹: ${matchedPoint.payload.description}`);
    } else {
      console.log('❌ 在知識庫中找不到相關的景點介紹。');
    }
    console.log('--------------------------------------------------\n');

  } catch (error) {
    console.error('💥 搜尋過程中發生錯誤：', error);
  }
}

async function runTests() {
  console.log('🚀 開始測試台灣風景名勝知識庫搜尋功能...\n');
  
  // 測試 3 個完全沒有透露任何景點名稱的語意提問
  await searchKnowledgeBase('我想去南部曬太陽、玩水看沙灘，順便看燈塔');
  await searchKnowledgeBase('台北附近哪裡可以泡溫泉跟看火山冒煙？');
  await searchKnowledgeBase('想要去高山上搭鐵路小火車看日出神木');
}

runTests();