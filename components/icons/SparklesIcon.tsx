import React from 'react';

interface IconProps {
  className?: string;
}

const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.188l-1.25.75L17 15.812 18.25 18l1.25-2.188L21.5 15l-1.75-.75L21.5 12l-1.25-2.188L18.25 6l-1.25 2.188L15 9l1.75.75L15 12h.094c.072.596.144 1.192.24 1.788Z" />
  </svg>
);

export default SparklesIcon;
