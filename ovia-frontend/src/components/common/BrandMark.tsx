import React from 'react';
import oviaLogo from '../../assets/oviaLogo.jpg';

interface BrandMarkProps {
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className = '' }) => (
  <img src={oviaLogo} alt="OVIA logo" className={`object-cover ${className}`} />
);
