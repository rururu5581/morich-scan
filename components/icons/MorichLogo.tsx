import React from 'react';

const MorichLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/morich.jpg" // ← ファイル名を "morich.jpg" に修正しました！
    alt="株式会社morich ロゴ"
    className={className} // App.tsxから渡される可能性を考慮して残しておきます
    style={{ height: '40px', width: 'auto' }}
  />
);

export default MorichLogo;