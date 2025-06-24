import React from 'react';

interface IconProps {
  className?: string;
}

const LightBulbIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.355a7.5 7.5 0 0 1-4.5 0m4.5 0v.75A2.25 2.25 0 0 1 13.5 21h-3a2.25 2.25 0 0 1-2.25-2.25V18m1.5-3H9m6 0h-1.5m1.5 0A2.25 2.25 0 0 0 13.5 12.75V9A2.25 2.25 0 0 0 11.25 6.75 2.25 2.25 0 0 0 9 9v3.75m3-6.75A2.25 2.25 0 0 0 9.75 4.5v.003A2.25 2.25 0 0 0 7.5 6.75v.498c0 .363.09.71.255 1.017a4.5 4.5 0 0 0 4.49 3.486A4.5 4.5 0 0 0 16.5 11.25v-.498A2.25 2.25 0 0 0 14.25 9v-.003A2.25 2.25 0 0 0 12 6.75Zm3 11.25H9" />
  </svg>
);

export default LightBulbIcon;
