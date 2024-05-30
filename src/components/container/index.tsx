import * as React from 'react';

interface IProps {
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<IProps> = ({ children, className }) => (
  <div
    className={`${className} mx-auto px-5 pb-5 sm:w-[480px] md:w-[480px] lg:w-[480px] xl:w-[480px] 2xl:w-[480px]`}
  >
    {children}
  </div>
);

export default React.memo(Container);
