
import React from 'react';
import { ResumeAnalysis } from '../types';
import ClipboardDocListIcon from './icons/ClipboardDocListIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import StarIcon from './icons/StarIcon';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';
import ChatBubbleLeftRightIcon from './icons/ChatBubbleLeftRightIcon';
import CursorArrowRaysIcon from './icons/CursorArrowRaysIcon';
import DocumentArrowDownIcon from './icons/DocumentArrowDownIcon'; // Import new icon
import { generateAnalysisPdf } from '../services/pdfService'; // Import PDF service


interface AnalysisDisplayProps {
  result: ResumeAnalysis;
}

interface AnalysisSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, icon, children }) => (
  <div className="bg-neutral-50 p-6 rounded-lg shadow-xl mb-6">
    <h3 className="text-xl font-semibold text-red-700 mb-3 flex items-center">
      {icon}
      {title}
    </h3>
    <div className="text-neutral-700 space-y-2">{children}</div>
  </div>
);

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  if (!result) {
    return null;
  }

  const { job_suggestions } = result;

  const handleDownloadPdf = () => {
    // Basic error handling for font data placeholder
    // In a real app, this check might be more sophisticated or removed if font is guaranteed.

    if (typeof process === 'object' && process.env.NODE_ENV !== 'production') { // Example: show alert only in dev
        // This is a simplified check. In pdfService, NOTO_SANS_JP_REGULAR_BASE64 is checked.
        // A more robust solution involves ensuring the font is properly configured.
        const isFontPlaceholderActive = true; // Simulate check for placeholder for demo
        if (isFontPlaceholderActive) { // This condition needs to be true if the font is still a placeholder.
             const userConfirmed = window.confirm(
`PDF出力機能は日本語フォントデータ（Noto Sans JP）が必要です。
現在はフォントデータのプレースホルダーが使用されており、日本語が正しく表示されない可能性があります。
このまま続行しますか？

(開発者向け: services/pdfService.ts内のNOTO_SANS_JP_REGULAR_BASE64を実際のフォントデータに置き換えてください。)`);
            if(!userConfirmed) return;
        }
    }
    generateAnalysisPdf(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPdf}
          className="flex items-center px-4 py-2 border border-red-600 text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md shadow-sm transition duration-150 ease-in-out"
          title="分析結果をPDFとしてダウンロード"
          aria-label="分析結果をPDFとしてダウンロード"
        >
          <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
          PDF出力
        </button>
      </div>

      <div className="space-y-8"> {/* Increased spacing between sections */}
        <AnalysisSection title="職務要約" icon={<ClipboardDocListIcon className="w-6 h-6 mr-2 text-red-600" />}>
          <p className="whitespace-pre-wrap">{result.summary}</p>
        </AnalysisSection>

        <AnalysisSection title="保有スキル" icon={<LightBulbIcon className="w-6 h-6 mr-2 text-red-600" />}>
          {result.skills && result.skills.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {result.skills.map((skill, index) => (
                <li key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm shadow-sm">{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-neutral-500">特筆すべきスキルは抽出されませんでした。</p>
          )}
        </AnalysisSection>

        <AnalysisSection title="職務経歴概要" icon={<BriefcaseIcon className="w-6 h-6 mr-2 text-red-600" />}>
          <p className="whitespace-pre-wrap">{result.experience_summary}</p>
        </AnalysisSection>

        <AnalysisSection title="主な強み" icon={<StarIcon className="w-6 h-6 mr-2 text-yellow-500" />}>
          <p className="whitespace-pre-wrap">{result.strength}</p>
        </AnalysisSection>

        <AnalysisSection title="潜在的な懸念点と面談での確認ポイント" icon={<ExclamationTriangleIcon className="w-6 h-6 mr-2 text-amber-600" />}>
          <p className="whitespace-pre-wrap">{result.potential_concerns}</p>
        </AnalysisSection>

        <AnalysisSection title="キャリア面談質問例" icon={<ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 text-sky-600" />}>
          {result.interview_question_examples && result.interview_question_examples.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 pl-2">
              {result.interview_question_examples.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-neutral-500">具体的な面談質問例は生成されませんでした。</p>
          )}
        </AnalysisSection>

        <AnalysisSection title="マッチするであろうJOB提案" icon={<CursorArrowRaysIcon className="w-6 h-6 mr-2 text-emerald-600" />}>
          {job_suggestions ? (
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-neutral-700 mb-1">提案職種：</h4>
                {job_suggestions.positions && job_suggestions.positions.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {job_suggestions.positions.map((position, index) => (
                      <li key={index}>{position}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-neutral-500">具体的な職種提案はありませんでした。</p>
                )}
              </div>
              
              {(job_suggestions.company_scale_details && job_suggestions.company_scale_details.length > 0) || job_suggestions.supplementary_text ? <hr className="my-3 border-neutral-200" /> : null}


              {job_suggestions.company_scale_details && job_suggestions.company_scale_details.length > 0 && (
                <div>
                  <h4 className="font-semibold text-neutral-700 mt-2 mb-1">企業規模・フェーズなど：</h4>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {job_suggestions.company_scale_details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {job_suggestions.supplementary_text && (
                <div>
                  <h4 className="font-semibold text-neutral-700 mt-3 mb-1">補足情報：</h4>
                  <p className="whitespace-pre-wrap">{job_suggestions.supplementary_text}</p>
                </div>
              )}
              
              {(!job_suggestions.positions || job_suggestions.positions.length === 0) &&
               (!job_suggestions.company_scale_details || job_suggestions.company_scale_details.length === 0) &&
               !job_suggestions.supplementary_text && (
                <p className="italic text-neutral-500">具体的なJOB提案は生成されませんでした。</p>
              )}

            </div>
          ) : (
            <p className="italic text-neutral-500">具体的なJOB提案は生成されませんでした。</p>
          )}
        </AnalysisSection>
      </div>
    </div>
  );
};

export default AnalysisDisplay;