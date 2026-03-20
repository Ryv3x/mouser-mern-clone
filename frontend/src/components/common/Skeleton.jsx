import React from 'react';

const Skeleton = ({ width = '100%', height = '1rem' }) => {
  return <div className="skeleton bg-gray-300 animate-pulse" style={{ width, height }} />;
};

export default Skeleton;
