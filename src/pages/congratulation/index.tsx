import React from 'react';
import { IoIosPlay } from 'react-icons/io';
import { Button, Congrats } from '@/components';
import { Footer, Layout } from '@/container';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <Layout title="">
    <Congrats message="Să începem sondajul !" />

    <Footer>
      <Link to="/form" className="w-full">
        <Button
          text="Trimite"
          type="submit"
          variant="primary"
          icon={<IoIosPlay size={20} color="#fff" />}
          className="px-4 py-2"
          hasIcon
        />
      </Link>
    </Footer>
  </Layout>
);

export default React.memo(Home);
