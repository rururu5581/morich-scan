import React from 'react';

const MorichLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src="/public/morich_logo.png"
    alt="株式会社morich ロゴ"
    className={className}
    style={{ height: '40px', width: 'auto' }}
  />
);

export default MorichLogo;
