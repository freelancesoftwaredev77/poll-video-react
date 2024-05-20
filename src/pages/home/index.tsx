import * as React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { VideoPlayer, VideoSkeleton } from '@/components';
import { Footer, Layout } from '@/container';
import { IntroDataType } from '@/types';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';

const Home: React.FC = () => {
  const [introData, setIntroData] = React.useState<IntroDataType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate: NavigateFunction = useNavigate();

  const handleEndVideo = () => navigate('/demo');

  const fetchIntro: () => Promise<void> = async (): Promise<void> => {
    setIsLoading(true);
    const { data: polls, error } = await supabase.from('polls').select('*');
    if (polls) {
      setIntroData(polls);
      setIsLoading(false);
    }
    if (error) {
      toastAlert('error', 'Something went wrong');
      setIsLoading(false);
    }

    setIsLoading(false);
  };
  React.useEffect((): void => {
    fetchIntro();
  }, []);

  return (
    <Layout>
      <h6 className="text-center mt-5 mb-10 font-bold text-[22px]">Welcome</h6>
      {isLoading ? (
        <VideoSkeleton />
      ) : (
        <VideoPlayer
          url={introData[0]?.demo_video ?? ''}
          handleEndVideo={handleEndVideo}
        />
      )}

      <Footer>
        <h6 className="text-center mt-5 font-bold">
          {introData && introData[0]?.title}
        </h6>
      </Footer>
    </Layout>
  );
};

export default React.memo(Home);
