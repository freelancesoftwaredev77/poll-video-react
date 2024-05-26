import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosPlay } from 'react-icons/io';
import { Button, Congrats } from '@/components';
import { Footer, Layout } from '@/container';

const Congratulations: React.FC = () => (
  <Layout>
    <Congrats message="Your answers have been submitted." />

    <Footer>
      <Link to="/form">
        <Button
          text="Start Poll"
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

export default React.memo(Congratulations);
