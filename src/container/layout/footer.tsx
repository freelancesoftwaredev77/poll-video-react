import * as React from 'react';

interface IProps {
  children: React.ReactNode;
}

const Footer: React.FC<IProps> = ({ children }) => (
  <div className="bg-white fixed -bottom-5 left-0 right-0 w-full mx-auto sm:w-[480px] md:w-[480px] xl:w-[480px] lg:w-[480px] 2xl:w-[480px] p-5 ">
    {children}
  </div>
);

export default React.memo(Footer);
