import React from 'react';

const TripSkeleton: React.FC = () => (
  <div className="h-[90%] animate-pulse cursor-pointer overflow-hidden rounded-md bg-[#efefefb7]" />
);

export default React.memo(TripSkeleton);
