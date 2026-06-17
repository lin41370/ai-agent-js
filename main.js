import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";
// 1. 引入工具註冊中心
import { toolsSchema, handleToolCall } from "./tools/index.js";
import { JSONFilePreset } from 'lowdb/node';

// 初始化資料庫，並給予預設值
const defaultData = { messages: [] };
const db = await JSONFilePreset('db.json', defaultData); // ✅ 確保這行有執行且變數名稱為 db

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  "你是一個實用的生活助手。如果使用者要求換算單位，請主動使用單位換算工具來取得精準結果。"
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    // 2. 第一次呼叫：告訴 AI 我們有哪些「工具」可以使用
    let response = await client.chat.completions.create({
      model: "gpt-5-mini", // 或是課程指定的模型
      messages: getMessages(),
      tools: toolsSchema.map(schema => ({ type: "function", function: schema })) 
    });

    let responseMessage = response.choices[0].message;

    // 3. 檢查 AI 是否想要「呼叫工具」
    if (responseMessage.tool_calls) {
      console.log("\n🤖 [AI 決定呼叫工具進行換算]...");
      
      // 為了維持歷史紀錄的完整性，必須先將 AI 帶有 tool_calls 的回應存入資料庫
      // 由於老師的 db 模組沒有直接存特殊 Object 的簡便函數，我們用 addMessage 存入
      db.data.messages.push(responseMessage); 
      await db.write();

      // 依序處理 AI 要求執行的每一個工具
      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        console.log(`💡 正在執行本機函數: ${functionName}, 參數:`, functionArgs);
        
        // 4. 執行我們寫好的單位換算工具
        const toolResult = await handleToolCall(functionName, functionArgs);
        
        // 5. 將工具運算的結果存入歷史紀錄（role 必須是 tool，且要附上 tool_call_id）
        db.data.messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(toolResult)
        });
        await db.write();
      }

      // 6. 第二次呼叫：把工具運算完的結果一併丟回給 AI，讓它做最後的人類語言統整
      const finalResponse = await client.chat.completions.create({
        model: "gpt-5-mini",
        messages: getMessages()
      });

      const finalContent = finalResponse.choices[0].message.content;
      console.log(`\n${finalContent}\n`);

      // 把 AI 的最終文字回答存檔
      await addMessage(finalContent, "assistant");

    } else {
      // 如果 AI 不需要使用工具，直接走原本的流程印出文字
      const content = responseMessage.content;
      console.log(`\n${content}\n`);
      await addMessage(content, "assistant");
    }
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
