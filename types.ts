
export interface JobSuggestionDetails {
  positions: string[]; // マッチ度の高い順
  company_scale_details: string[]; // 例: "IPO準備～IPO後の早期スタートアップ", "メガベンチャー"
  supplementary_text: string; // 例: "経営陣と距離が近く..."
}

export interface ResumeAnalysis {
  summary: string;
  skills: string[];
  experience_summary: string;
  strength: string;
  potential_concerns: string;
  interview_question_examples: string[];
  job_suggestions: JobSuggestionDetails; //以前は job_suggestions_detail: string でした
}