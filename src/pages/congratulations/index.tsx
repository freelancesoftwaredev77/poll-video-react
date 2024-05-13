import React from 'react';
import { IoIosPlay } from 'react-icons/io';
import { Button } from '@/components';
import { Footer, Layout } from '@/container';
import { Link } from 'react-router-dom';

interface IProps {}

const Home: React.FC<IProps> = ({}) => (
  <Layout title="">
    <div className="mt-[40%]">
      <img src="/go.png" alt="go" className="w-32 h-32 object-cover mx-auto" />

      <div className="font-bold my-3 text-center">
        <h6>Congratulations!</h6>
        <h6>Let’s start the poll</h6>
      </div>
    </div>

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

export default React.memo(Home);
