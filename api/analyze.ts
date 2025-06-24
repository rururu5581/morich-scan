// /api/analyze.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ message: 'resumeText is required' });
    }
    
    // このプロンプトは、あなたの constants.ts などからコピーしてください
    const GEMINI_PROMPT_SYSTEM_INSTRUCTION = `あなたは優秀なキャリアコンサルタントです。提供された職務経歴書のテキストを分析し、以下のJSON形式で結果を返してください...`;
    const fullPrompt = `${GEMINI_PROMPT_SYSTEM_INSTRUCTION}\n\n# 職務経歴書テキスト\n${resumeText}`;

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error("API_KEY is not set on the server.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest", // モデル名を最新のものに更新
      generationConfig: {
        responseMimeType: "application/json",
      },
     });

    // ▼▼▼ この部分をライブラリの仕様に合わせて修正しました ▼▼▼
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();
    // ▲▲▲ この部分を修正しました ▲▲▲
        // ▼▼▼ この行を追加 ▼▼▼
    console.log("AIからの生の応答:", responseText); 
    // 成功したら、AIからの応答テキスト（JSON文字列）を返す
    res.status(200).json({ result: responseText });

  } catch (error: any) {
    console.error("Error in API route:", error);
    res.status(500).json({ message: error.message || 'An unknown server error occurred.' });
  }
}