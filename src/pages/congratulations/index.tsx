import React from 'react';
import { IoIosPlay } from 'react-icons/io';
import { Button } from '@/components';
import { Footer, Layout } from '@/container';

interface IProps {}

const Home: React.FC<IProps> = ({}) => (
  <Layout title="">
    <img src="/go.png" alt="go" className="w-32 h-32 object-cover mx-auto" />
    <div className="font-bold my-3 text-center">
      <h6>Congratulations!</h6>
      <h6>Let’s start the poll</h6>
    </div>

    <Footer>
      <Button
        text="Submit"
        type="submit"
        variant="primary"
        icon={<IoIosPlay size={20} color="#fff" />}
        className="px-4 py-2"
        hasIcon
      />
    </Footer>
  </Layout>
);

export default React.memo(Home);
