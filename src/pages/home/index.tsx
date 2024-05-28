import * as React from 'react';
import { Button, VideoPlayer, VideoSkeleton } from '@/components';
import { Footer, Layout } from '@/container';
// import { IoIosPlay } from 'react-icons/io';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';

const Home: React.FC = () => {
  const { data: introData, isLoading } = useFetch('polls');
  const [isPlaying, setIsPlaying] = React.useState(false);

  const navigate: NavigateFunction = useNavigate();

  return (
    <Layout>
      <h6 className="text-center mt-5 mb-5 font-bold text-[22px]">
        {isPlaying ? 'Instrucțiuni' : 'Bun venit!'}
      </h6>
      {isLoading ? (
        <VideoSkeleton />
      ) : (
        <VideoPlayer
          url={(introData && introData[0]?.demo_video) ?? ''}
          setIsPlaying={setIsPlaying}
        />
      )}

      <Footer>
        <h6 className="text-center mt-5 font-bold">
          {isPlaying ? (
            <div className="flex items-center gap-5">
              <Link to="/form" className="w-full">
                <Button
                  text="Începe sondajul"
                  type="submit"
                  variant="primary"
                  className="px-4 py-2"
                />
              </Link>
              <Link
                to="/demo"
                className="w-full"
                state={{
                  instructionVideoUrl:
                    introData && introData[0]?.instruction_video,
                }}
              >
                <Button
                  text="Demo"
                  type="button"
                  variant="outline"
                  className="px-4 py-2"
                  onClick={() => navigate('/demo')}
                />
              </Link>
            </div>
          ) : (
            introData && introData[0]?.title
          )}
        </h6>
      </Footer>
    </Layout>
  );
};

export default React.memo(Home);
