import React, { useState, useCallback } from 'react';
import { ResumeAnalysis } from './types';
import ResumeInputForm from './components/ResumeInputForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import SparklesIcon from './components/icons/SparklesIcon';
import MorichLogo from './components/icons/MorichLogo';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ▼▼▼ この関数にデバッグ用の console.log を追加しました ▼▼▼
  const handleAnalyzeClick = useCallback(async () => {
    if (!resumeText.trim()) {
      setError("職務経歴書のテキストは空にできません。");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); 
    try {
      // サーバーAPIを呼び出す
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText: resumeText }),
      });

      const data = await response.json();
      
      // 【デバッグログ1】サーバーから何が返ってきたか確認
      console.log("サーバーからの応答データ:", data);

      if (!response.ok) {
        throw new Error(data.message || 'サーバーで分析エラーが発生しました。');
      }

      // 【デバッグログ2】JSON.parseにかける文字列を確認
      console.log("JSON.parseする対象:", data.result);

      // サーバーから返ってきたJSON文字列をJavaScriptオブジェクトに変換
      const result: ResumeAnalysis = JSON.parse(data.result);

      // 【デバッグログ3】パースが成功したか、オブジェクトの中身を確認
      console.log("パース後のオブジェクト:", result);

      setAnalysisResult(result);

    } catch (e: any) {
      // 【デバッグログ4】エラーが発生した場合、その内容を確認
      console.error("分析処理中にエラーが発生しました:", e);
      setError(e.message || "分析中に予期せぬエラーが発生しました。");
      console.error("App.tsxでの分析エラー:", e);
    } finally {
      setIsLoading(false);
    }
  }, [resumeText]);
  // ▲▲▲ ここまで ▲▲▲

  const handleClearText = useCallback(() => {
    setResumeText('');
    setAnalysisResult(null);
    setError(null);
  }, []);

  const PlaceholderForAnalysis: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-neutral-50 rounded-xl shadow-xl text-center h-full">
      <SparklesIcon className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-red-800 mb-2">職務経歴書分析結果</h3>
      <p className="text-neutral-600">
        左側の入力エリアに職務経歴書を入力し、「経歴書を分析」をクリックしてください。
      </p>
      <p className="text-neutral-600">
        AIによる要約、スキル、強み、懸念点、面談質問例、JOB提案などがここに表示されます。
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-red-800 p-4 sm:p-6 md:p-8 selection:bg-red-500 selection:text-white">
      <header className="text-center mb-8 sm:mb-12">
        <div className="flex justify-center mb-4">
          <MorichLogo />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
          morich profile scan
        </h1>
        <p className="mt-2 text-lg text-neutral-700 max-w-2xl mx-auto">
          Gemini AIを活用して、職務経歴書をScanするよ
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:pr-4">
          <ResumeInputForm
            resumeText={resumeText}
            onResumeTextChange={setResumeText}
            onAnalyze={handleAnalyzeClick}
            isLoading={isLoading}
            onClear={handleClearText}
          />
        </div>
        
        <div className="lg:pl-4">
          {isLoading && <LoadingSpinner />}
          {error && !isLoading && <ErrorAlert message={error} />}
          {analysisResult && !isLoading && !error && <AnalysisDisplay result={analysisResult} />}
          {!analysisResult && !isLoading && !error && <PlaceholderForAnalysis />}
        </div>
      </main>

      <footer className="text-center mt-12 sm:mt-16 py-6 border-t border-neutral-300">
        <p className="text-sm text-neutral-500">
          Powered by Google Gemini API © {new Date().getFullYear()} 株式会社morich
        </p>
      </footer>
    </div>
  );
};

export default App;