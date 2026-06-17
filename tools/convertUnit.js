// 步驟 2：定義工具 JSON Schema
export const convertUnitSchema = {
  name: "convert_unit",
  description: "進行單位換算（支援攝氏/華氏、公里/英里、公斤/磅）",
  parameters: {
    type: "object",
    properties: {
      value: {
        type: "number",
        description: "需要換算的數值數字，例如 25"
      },
      from_unit: {
        type: "string",
        description: "原始單位，例如：C, F, km, mile, kg, lb"
      },
      to_unit: {
        type: "string",
        description: "目標單位，例如：C, F, km, mile, kg, lb"
      }
    },
    required: ["value", "from_unit", "to_unit"]
  }
};

// 步驟 3 & 4：實作換算函數與不支援處理
export async function convertUnit({ value, from_unit, to_unit }) {
  const from = from_unit.toLowerCase();
  const to = to_unit.toLowerCase();

  // 1. 溫度：攝氏 (c) 與 華氏 (f)
  if (from === 'c' && to === 'f') {
    return { result: value * 9 / 5 + 32, unit: to_unit };
  }
  if (from === 'f' && to === 'c') {
    return { result: (value - 32) * 5 / 9, unit: to_unit };
  }

  // 2. 長度：公里 (km) 與 英里 (mile)
  if (from === 'km' && to === 'mile') {
    return { result: value * 0.621371, unit: to_unit };
  }
  if (from === 'mile' && to === 'km') {
    return { result: value / 0.621371, unit: to_unit };
  }

  // 3. 重量：公斤 (kg) 與 磅 (lb)
  if (from === 'kg' && to === 'lb') {
    return { result: value * 2.20462, unit: to_unit };
  }
  if (from === 'lb' && to === 'kg') {
    return { result: value / 2.20462, unit: to_unit };
  }

  // 步驟 4：不支援的單位，回傳錯誤訊息給 AI
  return { 
    error: `不支援從 ${from_unit} 換算到 ${to_unit}。目前僅支援 C/F, km/mile, kg/lb 之間的換算。` 
  };
}