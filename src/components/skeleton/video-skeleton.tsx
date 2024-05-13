import React from 'react';

interface IProps {}

const TripSkeleton: React.FC<IProps> = ({}) => (
  <div className="bg-[#C7C7C7] animate-pulse border border-opacity-15 border-dark-grey rounded-md cursor-pointer overflow-hidden">
    <div className="h-96 bg-[#c7c7c7] rounded-lg" />
  </div>
);

export default React.memo(TripSkeleton);
