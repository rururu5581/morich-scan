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
      // --- デバッグログ ---
      console.log("PDFエクスポート処理を開始します。");
      const doc = new jsPDF();

      // --- ステップ1: 日本語フォントの読み込みと登録 ---
      const fontUrl = '/fonts/NotoSansJP-Regular.ttf';
      console.log("読み込むフォントのURL:", fontUrl);
      
      const response = await fetch(fontUrl);
      console.log("フォントファイルのfetchレスポンス:", response);
      if (!response.ok) {
        throw new Error(`フォントの読み込みに失敗しました。Status: ${response.status}`);
      }

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
      console.log("jsPDFにフォントを登録しました:", fontName);
      
      // --- ステップ2: PDFコンテンツの描画 ---
      doc.setFont(fontName);
      console.log("デフォルトフォントを", fontName, "に設定しました。");

      // doc.text() は長いテキストを自動で折り返さないため、手動で分割する
      const splitText = (text: string, maxWidth: number) => doc.splitTextToSize(text, maxWidth);

      let y = 20; // 描画位置のY座標

      doc.setFontSize(16);
      doc.text("職務要約", 10, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(splitText(result.summary, 180), 15, y);
      y += 30; // 適宜スペースを調整

      doc.setFontSize(16);
      doc.text("保有スキル", 10, y);
      y += 10;
      doc.setFontSize(10);
      result.skills.forEach(skill => {
        doc.text(`- ${skill}`, 15, y);
        y += 7;
      });
      y += 10;

      // ... 他の項目も同様に追加していく ...
      // strength, potential_concerns なども上記のように描画ロジックを追加してください。
      
      // --- ステップ3: PDFの保存 ---
      doc.save("morich-profile-scan-result.pdf");
      console.log("PDFの保存処理を呼び出しました。");

    } catch (error) {
      console.error("PDFエクスポート中に致命的なエラーが発生しました:", error);
      alert("PDFの作成に失敗しました。詳細は開発者ツール（F12）のコンソールを確認してください。");
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
        <ul className="list-disc list-inside space-y-1">
          {result.skills.map((skill, index) => <li key={index}>{skill}</li>)}
        </ul>
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

      {/* 必要であれば他の項目もここに追加 */}
    </div>
  );
};

export default AnalysisDisplay;