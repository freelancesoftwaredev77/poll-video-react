import * as React from 'react';

interface IProps {
  children: React.ReactNode;
}

const Footer: React.FC<IProps> = ({ children }) => (
  <div className="fixed -bottom-5 left-0 right-0 mx-auto w-full bg-white px-5 pb-10 sm:w-[480px] md:w-[480px] lg:w-[480px] xl:w-[480px] 2xl:w-[480px]">
    {children}
  </div>
);

export default React.memo(Footer);
