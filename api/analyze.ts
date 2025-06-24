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
    
    // constants.tsからプロンプトを反映
    const GEMINI_PROMPT_SYSTEM_INSTRUCTION = `あなたは優秀なキャリアアドバイザーです。以下の制約条件と出力形式に従って、入力された職務経歴書テキストを分析し、要点を抽出・要約してください。

# 制約条件
- 経歴全体を客観的に評価してください。
- 候補者の強みだけでなく、キャリアにおける潜在的な懸念点や、面談で深掘りすべき点も指摘してください。
- 抽出された情報に基づいて、候補者へのキャリア面談で尋ねるべき具体的な質問例を3～5個提案してください。質問は具体的で、候補者の経験やスキルを深掘りするものであるべきです。
- 候補者のスキル、経験、強み、志向性（もし読み取れれば）に基づいて、マッチしそうなJOB提案を行ってください。提案は以下の詳細を含む構造化された形式であるべきです：
    1.  **マッチする職種 (positions)**: マッチ度の高い順に職種のリストを提示してください。
    2.  **企業規模・フェーズ等 (company_scale_details)**: 候補者にマッチしそうな企業の規模、フェーズ、またはその他の特徴（例：IPO準備、SaaS業界など）をリスト形式で記述してください。
    3.  **補足情報 (supplementary_text)**: 上記提案の理由や、候補者の志向に合うであろう環境（例：経営陣との距離が近い、裁量権が大きいなど）について補足説明を記述してください。
- 各項目は簡潔にまとめてください。
- 出力は必ず指定されたJSON形式で、他のテキストは含めないでください。

# 出力形式 (JSON)
{
 "summary": "（ここに300字程度の職務要約を記述）",
 "skills": ["スキル1", "スキル2", "スキル3"],
 "experience_summary": "（ここに経験社数や合計経験年数などを記述）",
 "strength": "（ここに候補者の強みを分析して記述）",
 "potential_concerns": "（ここに面談で確認すべき点を記述）",
 "interview_question_examples": ["（面談での質問例1）", "（質問例2）", "（質問例3）"],
 "job_suggestions": {
    "positions": ["（マッチ度順の職種1）", "（職種2）", "（職種3）"],
    "company_scale_details": ["（企業規模・フェーズの詳細1）", "（詳細2）"],
    "supplementary_text": "（これらの提案理由や、候補者に合う環境などの補足情報）"
  }
}`;
    
    const fullPrompt = `${GEMINI_PROMPT_SYSTEM_INSTRUCTION}\n\n# 職務経歴書テキスト\n${resumeText}`;

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error("API_KEY is not set on the server.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest", // 最新の推奨モデル
      generationConfig: {
        responseMimeType: "application/json",
      },
     });

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();
    
    // デバッグ用にAIからの生の応答をログに出力
    console.log("AIからの生の応答:", responseText); 
    
    // 成功したら、AIからの応答テキスト（JSON文字列）を返す
    res.status(200).json({ result: responseText });

  } catch (error: any) {
    console.error("Error in API route:", error);
    res.status(500).json({ message: error.message || 'An unknown server error occurred.' });
  }
}