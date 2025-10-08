// /api/analyze.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ message: 'resumeText is required' });
    }

    const GEMINI_PROMPT_SYSTEM_INSTRUCTION = `あなたは優秀なキャリアアドバイザーです。
以下の制約条件と出力形式に従って、入力された職務経歴書テキストを分析し、要点を抽出・要約してください。

# 制約条件
- 経歴全体を客観的に評価してください。
- 候補者の強みだけでなく、キャリアにおける潜在的な懸念点も指摘してください。
- 候補者のスキル、経験、強み、志向性に基づき、マッチする職種を提案してください。
- 出力は必ず指定されたJSON形式で出力してください。

# 出力形式 (JSON)
{
 "summary": "...",
 "skills": ["スキル1", "スキル2"],
 "experience_summary": "...",
 "strength": "...",
 "potential_concerns": "...",
 "interview_question_examples": ["質問1", "質問2"],
 "job_suggestions": {
    "positions": ["職種1", "職種2"],
    "company_scale_details": ["企業フェーズ1", "フェーズ2"],
    "supplementary_text": "補足"
  }
}`;

    const fullPrompt = `${GEMINI_PROMPT_SYSTEM_INSTRUCTION}\n\n# 職務経歴書テキスト\n${resumeText}`;

    const API_KEY = process.env.GOOGLE_API_KEY || process.env.API_KEY;
    if (!API_KEY) throw new Error("API_KEY is not set on the server.");

    // ✅ 修正版: モデル名を最新に
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    console.log("AI応答:", responseText);

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = responseText;
    }

    res.status(200).json({ result: parsed });

  } catch (error: any) {
    console.error("Error in API route:", error);
    res.status(500).json({
      message: error.message || "An unknown error occurred",
      details: error.response?.data || null,
    });
  }
}
