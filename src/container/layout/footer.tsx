import * as React from 'react';

interface IProps {
  children: React.ReactNode;
}

const Footer: React.FC<IProps> = ({ children }) => (
  <div className="mx-auto mt-10 w-full bg-white px-4 sm:w-[480px] md:w-[480px] lg:w-[480px] xl:w-[480px] 2xl:w-[480px]">
    {children}
  </div>
);

export default React.memo(Footer);
