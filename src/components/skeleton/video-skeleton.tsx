import React from 'react';

const TripSkeleton: React.FC = () => (
  <div className="bg-[#c6c0c0ac] animate-pulse rounded-md cursor-pointer overflow-hidden h-[90%]" />
);

export default React.memo(TripSkeleton);
