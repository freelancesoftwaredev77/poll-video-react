import * as React from 'react';

interface IProps {
  children: React.ReactNode;
}

const Footer: React.FC<IProps> = ({ children }) => (
  <div className="mt-4 w-full bg-white">{children}</div>
);

export default React.memo(Footer);
