import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface ResumeInputFormProps {
  resumeText: string;
  onResumeTextChange: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onClear: () => void;
}

const ResumeInputForm: React.FC<ResumeInputFormProps> = ({
  resumeText,
  onResumeTextChange,
  onAnalyze,
  isLoading,
  onClear
}) => {
  return (
    <div className="bg-neutral-50 p-6 rounded-xl shadow-2xl space-y-6">
      <h2 className="text-2xl font-semibold text-red-700 flex items-center">
        <SparklesIcon className="w-7 h-7 mr-2 text-red-600" />
        職務経歴書入力
      </h2>
      <p className="text-neutral-600">
        候補者の職務経歴書の全文を以下に貼り付けてください。AIが分析し、構造化された要約を提供します。
      </p>
      <div>
        <label htmlFor="resumeText" className="block text-sm font-medium text-neutral-700 mb-1">
          職務経歴書テキストをここに貼り付け：
        </label>
        <textarea
          id="resumeText"
          value={resumeText}
          onChange={(e) => onResumeTextChange(e.target.value)}
          placeholder="職務経歴書の全文を入力してください..."
          rows={15}
          className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-neutral-800 placeholder-neutral-500 transition duration-150 ease-in-out"
          disabled={isLoading}
          aria-label="職務経歴書テキスト入力エリア"
        />
      </div>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onAnalyze}
          disabled={isLoading || !resumeText.trim()}
          className="w-full sm:w-auto flex-grow justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-50 focus:ring-red-500 disabled:bg-neutral-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          aria-live="polite"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              分析中...
            </>
          ) : (
            <div className="flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 mr-2" />
              経歴書を分析
            </div>
          )}
        </button>
        <button
          onClick={onClear}
          disabled={isLoading || !resumeText.trim()}
          className="w-full sm:w-auto px-6 py-3 border border-neutral-400 text-base font-medium rounded-md shadow-sm text-red-700 bg-neutral-200 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-50 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          クリア
        </button>
      </div>
    </div>
  );
};

export default ResumeInputForm;
