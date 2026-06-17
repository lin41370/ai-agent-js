export const getCurrentTimeTool = {
  type: "function",
  function: {
    name: "get_current_time",
    description: "查詢現在台灣台北當前的即時日期與時間。",
    parameters: {
      type: "object",
      properties: {}
    }
  }
};

export function getCurrentTime() {
  const now = new Date();
  // 轉換為台灣台北當地時間格式
  const timeString = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  return JSON.stringify({ current_time: timeString });
}