
import React from 'react';

interface IconProps {
  className?: string;
}

const ChatBubbleLeftRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.697-3.697C16.126 14.821 15 14.19 15 13.125V8.511c0-1.136.847-2.1 1.98-2.193.34-.027.68-.052 1.02-.072Zm-7.007 0c.884.284 1.5 1.128 1.5 2.097V16.5c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072V21l-3.697-3.697C6.127 14.821 5 14.19 5 13.125V8.511c0-1.136.847-2.1 1.98-2.193.34-.027.68-.052 1.02-.072Z" />
  </svg>
);

export default ChatBubbleLeftRightIcon;