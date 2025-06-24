import React from 'react';

export const MorichLogo: React.FC<{ className?: string; }> = ({ className }) => (
  <img
    src="/morich.jpg" // ← ここのパスを修正しました！
    alt="株式会社morich ロゴ"
    className={className}
    style={{ height: '40px', width: 'auto' }} />
);
