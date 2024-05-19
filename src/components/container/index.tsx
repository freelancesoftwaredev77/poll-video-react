import * as React from 'react';

interface IProps {
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<IProps> = ({ children, className }) => (
  <div
    className={`${className} mx-auto sm:w-[480px] md:w-[480px] xl:w-[480px] lg:w-[480px] 2xl:w-[480px] pb-5 px-5`}
  >
    {children}
  </div>
);

export default React.memo(Container);
