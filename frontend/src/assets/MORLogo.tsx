import React from 'react';

interface MORLogoProps {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

const MORLogo: React.FC<MORLogoProps> = ({ width = 48, height = 48, style }) => {
  return (
    <img
      src="/logo.jpg"
      alt="Ministry of Revenues Ethiopia"
      width={width}
      height={height}
      style={{ objectFit: 'contain', ...style }}
    />
  );
};

export default MORLogo;
