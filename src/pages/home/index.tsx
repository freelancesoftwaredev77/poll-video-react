import * as React from 'react';
import { Button, VideoPlayer, VideoSkeleton } from '@/components';
import { Footer, Layout } from '@/container';
// import { IoIosPlay } from 'react-icons/io';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import useBackButtonAlert from '@/components/alert';

const Home: React.FC = () => {
  const { data: introData, isLoading } = useFetch('polls');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const showAlert = useBackButtonAlert();

  const navigate: NavigateFunction = useNavigate();

  return (
    <Layout>
      <h6 className="mb-4 mt-5 text-center text-[22px] font-bold">
        {isPlaying ? 'Instrucțiuni' : 'Bun venit!'}
      </h6>
      {showAlert && (
        <div>
          <div>
            Sunteți sigur? Apăsarea din nou a butonului Înapoi va anula
            sondajul.
          </div>
        </div>
      )}
      {isLoading ? (
        <VideoSkeleton />
      ) : (
        <VideoPlayer
          url={(introData && introData[0]?.demo_video) ?? ''}
          setIsPlaying={setIsPlaying}
        />
      )}

      <Footer>
        <h6 className="text-center font-bold">
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
            <>
              <p>{introData && introData[0]?.title}</p>
              <Link
                to="/terms-conditions"
                className="text-sm font-normal text-[blue]"
              >
                Terms and conditions
              </Link>
            </>
          )}
        </h6>
      </Footer>
    </Layout>
  );
};

export default React.memo(Home);
