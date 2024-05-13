import * as React from 'react';

interface IProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<IProps> = ({ title, children, className }) => (
  <main
    className={`${className} w-full mx-auto sm:w-[480px] md:w-[480px] xl:w-[480px] lg:w-[480px] 2xl:w-[480px] pb-5 border border-light-grey min-h-screen px-5 relative`}
  >
    <section>
      {title && (
        <h1 className="text-primary text-[22px] font-bold mt-5 mb-20">
          {title}
        </h1>
      )}
      {children}
    </section>
  </main>
);

export default React.memo(Layout);
