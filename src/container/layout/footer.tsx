import * as React from 'react';

interface IProps {
  children: React.ReactNode;
}

const Footer: React.FC<IProps> = ({ children }) => (
  <div className="bg-white pt-5">{children}</div>
);

export default React.memo(Footer);
