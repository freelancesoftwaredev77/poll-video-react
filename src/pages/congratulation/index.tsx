import React from 'react';
import { Button, Message } from '@/components';
import { Footer, Layout } from '@/container';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <>
    <Layout title="">
      <Message
        message="Ai terminat demo-ul !"
        title="Felicitări !"
        imageUrl="/clap.png"
      />
    </Layout>
    <Footer>
      <Link to="/form" className="w-full">
        <Button
          text="Începe Sondajul"
          type="submit"
          variant="primary"
          className="px-4 py-2"
        />
      </Link>
    </Footer>
  </>
);

export default React.memo(Home);
