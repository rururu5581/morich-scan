import React from 'react';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';

interface ErrorAlertProps {
  message: string;
  title?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, title = "分析エラー" }) => {
  return (
    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-md relative" role="alert">
      <div className="flex items-center">
        <ExclamationTriangleIcon className="w-6 h-6 mr-3 text-red-500" />
        <div>
          <strong className="font-bold text-red-800">{title}</strong>
          <span className="block sm:inline ml-0 sm:ml-2">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
