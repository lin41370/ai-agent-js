import { convertUnitSchema, convertUnit } from "./convertUnit.js";
// 假設原本有 import { weatherSchema, getWeather } from "./weather.js";

// 提供給 LLM 的工具清單定義
export const toolsSchema = [
  convertUnitSchema
  // weatherSchema
];

// 建立對應表：當 AI 喊出名字時，能對應到真實的 JavaScript 函數
const registry = {
  "convert_unit": convertUnit
  // "get_weather": getWeather
};

// 執行工具的代理函數
export async function handleToolCall(name, args) {
  const tool = registry[name];
  if (!tool) {
    return { error: `找不到名為 ${name} 的工具` };
  }
  return await tool(args);
}