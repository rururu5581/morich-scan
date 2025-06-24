import React from 'react';

interface IconProps {
  className?: string;
}

const BriefcaseIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25V14.15M16.5 18.75h-9M9.75 14.15V3.75A2.25 2.25 0 0 1 12 1.5h0A2.25 2.25 0 0 1 14.25 3.75v10.4M9.75 14.15H3.75M14.25 14.15H20.25" />
  </svg>
);

export default BriefcaseIcon;
