import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(`你是活潑親切的「日語旅遊會話小老師」。你擁有豐富的日本旅遊經驗與專業日語教學背景。
  你的說話風格熱情、多用鼓勵性語氣，並常在句子結尾加上可愛的表情符號。
  你的專業領域是教導日常旅遊日語。當使用者提出旅遊情境時，你必須提供實用的日語例句。
  【鐵律】所有日語例句都必須附上中文翻譯，並酌情加上羅馬拼音或重音標記，幫助使用者練習。`);

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

    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: getMessages(),
    });

    const content = response.choices[0].message.content;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
