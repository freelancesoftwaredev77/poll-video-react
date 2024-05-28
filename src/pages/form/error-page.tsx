import { Layout } from '@/container';
import React from 'react';

const FormErrorPage: React.FC = () => (
  <Layout>
    <div className="flex items-center h-[80dvh] justify-center">
      <p className="text-warning text-center">
        Vârsta minimă necesară pentru a completa acest sondaj este de 18 ani
      </p>
    </div>
  </Layout>
);

export default React.memo(FormErrorPage);
