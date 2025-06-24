import React from 'react';

interface IconProps {
  className?: string;
}

const StarIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.31h5.513c.473 0 .724.586.331.919l-4.27 3.203a.563.563 0 0 0-.184.53l1.535 5.41a.562.562 0 0 1-.825.638l-4.594-3.523a.563.563 0 0 0-.668 0l-4.594 3.523a.562.562 0 0 1-.825-.638l1.535-5.41a.563.563 0 0 0-.184-.53L.49 9.84a.562.562 0 0 1 .331-.919h5.513a.563.563 0 0 0 .475-.31L11.48 3.5Z" />
  </svg>
);

export default StarIcon;
