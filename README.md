# AI Agent 實作工作坊（JavaScript 版）

by eddie@5xcampus.com
@lin41370 ➜ /workspaces/ai-agent-js (0206043-hw3) $ node scripts/embed-taiwan.js
📂 讀到 5 筆景點資料
ℹ️ 已建立 collection: taiwan_attractions
⏳ 正在向 OpenAI 請求生成向量定義...
🚀 正在寫入 Qdrant 向量資料庫...
✅ 台灣風景名勝知識庫建立完成！

@lin41370 ➜ /workspaces/ai-agent-js (0206043-hw3) $ node test-search.js
🚀 開始測試台灣風景名勝知識庫搜尋功能...

🔍 使用者提問: "我想去南部曬太陽、玩水看沙灘，順便看燈塔"
🎯 最推薦景點: 【墾丁】
📊 向量相似度分數: 0.4811
📖 景點特色介紹: 墾丁位於台灣最南端，屬於熱帶季風氣候。這裡擁有燦爛的陽光、潔白的沙灘與豐富的珊瑚礁生態。鵝鑾鼻燈塔、南灣海灘與墾丁大街是必訪的熱門景點。
--------------------------------------------------

🔍 使用者提問: "台北附近哪裡可以泡溫泉跟看火山冒煙？"
🎯 最推薦景點: 【陽明山】
📊 向量相似度分數: 0.5945
📖 景點特色介紹: 陽明山國家公園鄰近台北都會區，以獨特的火山地質與溫泉景觀著稱。大油坑、小油坑的噴氣孔終年冒著白煙，春季的小油坑海芋與陽明山花季吸引無數遊客。
--------------------------------------------------

🔍 使用者提問: "想要去高山上搭鐵路小火車看日出神木"
🎯 最推薦景點: 【阿里山】
📊 向量相似度分數: 0.4573
📖 景點特色介紹: 阿里山以五奇著稱：日出、雲海、鐵路、森林與晚霞。其中祝山日出與神木群最為聞名，春季還能欣賞滿山遍野的櫻花，是台灣最具代表性的高山山林景觀。
--------------------------------------------------
@lin41370 ➜ /workspaces/ai-agent-js (0206043-hw3) $ git push -u origin 0206043-hw3
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
remote: 
remote: Create a pull request for '0206043-hw3' on GitHub by visiting:
remote:      https://github.com/lin41370/ai-agent-js/pull/new/0206043-hw3
remote: 
To https://github.com/lin41370/ai-agent-js.git
 * [new branch]      0206043-hw3 -> 0206043-hw3
branch '0206043-hw3' set up to track 'origin/0206043-hw3'.