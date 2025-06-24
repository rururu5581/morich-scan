import React from 'react';

interface IconProps {
  className?: string;
}

const ClipboardDocListIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.884a2.25 2.25 0 0 1 2.25 2.25v1.5H7.5V6h-.75a2.25 2.25 0 0 0-2.25 2.25v9.75c0 1.242 1.008 2.25 2.25 2.25h9.75c1.242 0 2.25-1.008 2.25-2.25V9.379c0-.621-.258-1.166-.684-1.567L15.684 6.44A2.25 2.25 0 0 0 14.061 6H13.5M9 12h3.75" />
  </svg>
);

export default ClipboardDocListIcon;
