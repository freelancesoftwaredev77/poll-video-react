import * as React from 'react';

interface IProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<IProps> = ({ title, children, className }: IProps) => (
  <main
    className={`${className} relative mx-auto h-[72vh] px-4 pb-5 sm:w-[480px] md:w-[480px] lg:w-[480px] xl:w-[480px] 2xl:w-[480px]`}
  >
    <section className="h-full">
      {title && (
        <h1 className="mb-10 mt-5 text-[22px] font-bold text-primary">
          {title}
        </h1>
      )}
      {children}
    </section>
  </main>
);

export default React.memo(Layout);
