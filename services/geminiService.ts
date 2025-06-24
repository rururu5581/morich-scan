
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ResumeAnalysis, JobSuggestionDetails } from '../types';
import { GEMINI_PROMPT_SYSTEM_INSTRUCTION, GEMINI_MODEL_NAME } from '../constants';

// Ensure API_KEY is available, otherwise throw an error early
if (!process.env.API_KEY) {
  throw new Error("APIキーが設定されていません。環境変数 API_KEY を設定してください。");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  if (!resumeText.trim()) {
    throw new Error("職務経歴書のテキストは空にできません。");
  }

  const fullPrompt = `${GEMINI_PROMPT_SYSTEM_INSTRUCTION}\n\n# 職務経歴書テキスト\n${resumeText}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        // temperature: 0.5, // Optional: Adjust for more deterministic or creative output
      },
    });

    let jsonStr = response.text.trim();
    
    // Remove markdown fences if present (e.g., ```json ... ``` or ``` ... ```)
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr) as ResumeAnalysis;
      // Basic validation of the parsed structure
      if (
        typeof parsedData.summary !== 'string' ||
        !Array.isArray(parsedData.skills) ||
        typeof parsedData.experience_summary !== 'string' ||
        typeof parsedData.strength !== 'string' ||
        typeof parsedData.potential_concerns !== 'string' ||
        !Array.isArray(parsedData.interview_question_examples) ||
        !parsedData.interview_question_examples.every(q => typeof q === 'string') ||
        typeof parsedData.job_suggestions !== 'object' ||
        parsedData.job_suggestions === null ||
        !Array.isArray(parsedData.job_suggestions.positions) ||
        !parsedData.job_suggestions.positions.every(p => typeof p === 'string') ||
        !Array.isArray(parsedData.job_suggestions.company_scale_details) ||
        !parsedData.job_suggestions.company_scale_details.every(d => typeof d === 'string') ||
        typeof parsedData.job_suggestions.supplementary_text !== 'string'
      ) {
        console.error("解析されたJSONが期待されるResumeAnalysisの構造と一致しません:", parsedData);
        throw new Error("AIの応答形式が正しくありません。返されたデータの構造が期待したものではありません。");
      }
      return parsedData;
    } catch (parseError) {
      console.error("AIからのJSON応答の解析に失敗しました:", parseError, "生の応答テキスト:", jsonStr);
      throw new Error(`AIが有効なJSONとして解析できないデータを返しました。応答の冒頭: ${jsonStr.substring(0, 200)}...`);
    }

  } catch (error) {
    console.error("Gemini APIの呼び出しエラー:", error);
    if (error instanceof Error) {
         throw new Error(`AIによる職務経歴書の分析に失敗しました: ${error.message}`);
    }
    throw new Error("AIサービスとの通信中に不明なエラーが発生しました。");
  }
};