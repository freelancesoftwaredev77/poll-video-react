import { Message } from '@/components';
import { Layout } from '@/container';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FormErrorPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!state) {
      navigate('/form');
    }
  }, [navigate, state]);
  return (
    <Layout>
      <Message
        imageUrl={state === 'age-error' ? '/card.png' : '/location.png'}
        message={
          state === 'age-error'
            ? 'Vârsta minimă necesară pentru a completa acest sondaj este de 18 ani.'
            : 'Pentru a participa la acest sondaj, este necesar ca domiciliul dumneavoastră să fie în București.'
        }
      />
    </Layout>
  );
};

export default React.memo(FormErrorPage);
