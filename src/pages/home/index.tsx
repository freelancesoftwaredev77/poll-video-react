import { Button, VideoPlayer } from '@/components';
import { Footer, Layout } from '@/container';
import * as React from 'react';
import { IoIosPlay } from 'react-icons/io';
import { Link } from 'react-router-dom';

interface IProps {}

const Home: React.FC<IProps> = ({}) => {
  console.log('Values');
  return (
    <Layout>
      <h6 className="text-center my-5 font-bold text-[22px]">Welcome</h6>

      <VideoPlayer url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
      <Footer>
        <div className="flex items-center gap-3 mt-4 justify-end">
          <Link to="/congratulations" className="w-full">
            <Button
              text="Start Poll"
              type="button"
              variant="primary"
              icon={<IoIosPlay size={20} color="#fff" />}
              className="px-4 py-2"
              hasIcon
            />
          </Link>

          <Button
            text="Demo"
            type="button"
            variant="outline"
            className="px-4 py-2"
          />
        </div>
      </Footer>
    </Layout>
  );
};

export default React.memo(Home);
