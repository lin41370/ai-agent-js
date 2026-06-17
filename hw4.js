// hw4.js
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js"; // 仿照老師的寫法，從 config 引入
import { getCurrentTimeTool, getCurrentTime } from "./tools/current_time.js";
import { getNewYoubikeTool, getNewYoubike } from "./tools/newyoubike.js";

// 1. 完全仿照老師 main.js 引入靈感，直接實例化 OpenAI
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

const tools = [getNewYoubikeTool, getCurrentTimeTool];

const messages = [
  {
    role: "system",
    content: "你是一個貼心的台北生活助手。你擁有兩個強大的即時工具：'get_current_time'（時間工具）和 'get_new_youbike'（YouBike查詢工具）。你可以回答使用者現在的時間，以及台北市各行政區還有多少 YouBike 可以借。請注意，當使用者查詢 YouBike 時，必須確認提問包含具體的台北市行政區（如大安區、信義區）。如果使用者只說台北市，請禮貌地提示他們提供具體的行政區名稱。"
  }
];

async function askAI(userQuery) {
  console.log(`\n👤 使用者：${userQuery}`);
  messages.push({ role: "user", content: userQuery });

  // 使用 gpt-4o-mini 或符合你權限的模型
  let response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    tools: tools,
  });

  let responseMessage = response.choices[0].message; // ✅ 採用與老師相同的 choices[0] 指向方式

  if (responseMessage.tool_calls) {
    messages.push(responseMessage);

    for (const toolCall of responseMessage.tool_calls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);
      let toolResult = "";

      console.log(`🤖 [AI 決定呼叫工具]: ${functionName}...`);

      if (functionName === "get_new_youbike") {
        toolResult = await getNewYoubike(functionArgs);
      } else if (functionName === "get_current_time") {
        toolResult = getCurrentTime();
      }

      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: toolResult,
      });
    }

    const finalResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });
    
    console.log(`🤖 助手：${finalResponse.choices[0].message.content}`);
    messages.push(finalResponse.choices[0].message);
  } else {
    console.log(`🤖 助手：${responseMessage.content}`);
    messages.push(responseMessage);
  }
}

async function runHomeworkTests() {
  console.log("🚀 開始執行作業四整合測試（結合 Mock 快照容錯與原生 OpenAI 實例）...");
  
  await askAI("現在幾點");
  console.log("------------------------------------------");

  await askAI("信義區有youbike 可以借嗎 ?");
  console.log("------------------------------------------");

  await askAI("現在幾點? 大安區還有youbike可以借嗎 ?");
  console.log("\n✅ 測試完成！");
}

runHomeworkTests();