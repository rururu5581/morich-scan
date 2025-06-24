import React from 'react';
import jsPDF from 'jspdf';
import { ResumeAnalysis } from '../types'; // types.tsから型をインポート

// アイコンコンポーネントのインポート（実際のパスに合わせてください）
import BriefcaseIcon from './icons/BriefcaseIcon';
import SparklesIcon from './icons/SparklesIcon';
import StarIcon from './icons/StarIcon';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';
import ChatBubbleLeftRightIcon from './icons/ChatBubbleLeftRightIcon';
import DocumentArrowDownIcon from './icons/DocumentArrowDownIcon';

// コンポーネントが受け取るPropsの型定義
interface Props {
  result: ResumeAnalysis;
}

const AnalysisDisplay: React.FC<Props> = ({ result }) => {

  // PDF出力ボタンがクリックされたときの処理
  const handlePdfExport = async () => {
    try {
      const doc = new jsPDF();

      // --- フォントの読み込みと登録 ---
      const fontUrl = '/fonts/NotoSansJP-Regular.ttf';
      const response = await fetch(fontUrl);
      if (!response.ok) throw new Error(`フォント読み込み失敗: ${response.status}`);
      const fontBlob = await response.blob();
      const fontData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(fontBlob);
      });
      const fontBase64 = fontData.substring(fontData.indexOf(',') + 1);
      const fontName = 'NotoSansJP';
      doc.addFileToVFS('NotoSansJP-Regular.ttf', fontBase64);
      doc.addFont('NotoSansJP-Regular.ttf', fontName, 'normal');
      doc.setFont(fontName);

      // --- PDFコンテンツの描画 ---
      const leftMargin = 15;
      const contentWidth = 180; // A4幅(210mm) - 左右マージン(15*2)
      const yStep = 7;
      const yLargeStep = 12;
      let y = 20;

      const splitText = (text: string) => doc.splitTextToSize(text, contentWidth);
      
      doc.setFontSize(20);
      doc.text("職務経歴書 分析レポート", leftMargin, y);
      y += yLargeStep;
      doc.setDrawColor(200);
      doc.line(leftMargin, y, leftMargin + contentWidth, y);
      y += yLargeStep;

      const addSection = (title: string, content: string | string[]) => {
        doc.setFontSize(14);
        doc.text(title, leftMargin, y);
        y += yStep;
        doc.setFontSize(10);
        if (Array.isArray(content)) {
            content.forEach((item, index) => {
                const itemText = `${index + 1}. ${item}`;
                const splitItem = splitText(itemText);
                doc.text(splitItem, leftMargin, y);
                y += (splitItem.length * 5) + (yStep / 2);
            });
        } else {
            const splitContent = splitText(content);
            doc.text(splitContent, leftMargin, y);
            y += (splitContent.length * 5);
        }
        y += yLargeStep;
      };

      addSection("職務要約", result.summary);
      addSection("保有スキル", result.skills.join(' / '));
      addSection("主な強み", result.strength);
      addSection("潜在的な懸念点と面談での確認ポイント", result.potential_concerns);
      addSection("キャリア面談質問例", result.interview_question_examples);
      
      // JOB提案セクション
      doc.setFontSize(14);
      doc.text("JOB提案", leftMargin, y);
      y += yStep;
      doc.setFontSize(10);
      doc.text(`- 職種: ${result.job_suggestions.positions.join(', ')}`, leftMargin, y);
      y += yStep;
      doc.text(`- 企業規模/フェーズ: ${result.job_suggestions.company_scale_details.join(', ')}`, leftMargin, y);
      y += yStep;
      doc.text(`- 補足:`, leftMargin, y);
      y += yStep;
      const splitSupplementary = splitText(result.job_suggestions.supplementary_text);
      doc.text(splitSupplementary, leftMargin + 5, y);

      // --- PDFの保存 ---
      doc.save("morich-profile-scan-result.pdf");

    } catch (error) {
      console.error("PDFエクスポート中にエラー:", error);
      alert("PDFの作成に失敗しました。");
    }
  };

  // セクションごとの表示コンポーネント
  const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-800 flex items-center mb-4">
        <span className="mr-3 text-red-500">{icon}</span>
        {title}
      </h3>
      <div className="text-neutral-700 space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <button
        onClick={handlePdfExport}
        className="w-full flex items-center justify-center px-4 py-2 border border-red-500 text-red-600 font-semibold rounded-lg shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
      >
        <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
        PDF出力
      </button>

      <Section title="職務要約" icon={<BriefcaseIcon className="w-6 h-6" />}>
        <p className="whitespace-pre-wrap">{result.summary}</p>
      </Section>

      <Section title="保有スキル" icon={<SparklesIcon className="w-6 h-6" />}>
        <div className="flex flex-wrap gap-2">
          {result.skills.map((skill, index) => (
            <span key={index} className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </Section>
      
      <Section title="主な強み" icon={<StarIcon className="w-6 h-6" />}>
         <p className="whitespace-pre-wrap">{result.strength}</p>
      </Section>
      
      <Section title="潜在的な懸念点と面談での確認ポイント" icon={<ExclamationTriangleIcon className="w-6 h-6" />}>
         <p className="whitespace-pre-wrap">{result.potential_concerns}</p>
      </Section>

      <Section title="キャリア面談質問例" icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}>
         <ul className="list-decimal list-inside space-y-2">
          {result.interview_question_examples.map((question, index) => <li key={index}>{question}</li>)}
        </ul>
      </Section>

      <Section title="JOB提案" icon={<BriefcaseIcon className="w-6 h-6" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-neutral-700">マッチする職種</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.job_suggestions.positions.map((pos, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                  {pos}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-700">企業規模・フェーズ等</h4>
            <p className="whitespace-pre-wrap">{result.job_suggestions.company_scale_details.join(', ')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-700">補足情報</h4>
            <p className="whitespace-pre-wrap">{result.job_suggestions.supplementary_text}</p>
          </div>
        </div>
      </Section>

    </div>
  );
};

export default AnalysisDisplay;