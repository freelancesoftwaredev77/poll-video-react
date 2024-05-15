import * as React from 'react';

interface IProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<IProps> = ({ title, children, className }) => (
  <main className={`${className} px-5`}>
    <section>
      {title && (
        <h1 className="text-primary text-[22px] font-bold mt-5 mb-10">
          {title}
        </h1>
      )}
      {children}
    </section>
  </main>
);

export default React.memo(Layout);
