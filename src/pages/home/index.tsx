import * as React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '@/components';
import { Layout } from '@/container';
import { IntroDataType } from '@/types';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';

const Home: React.FC = () => {
  const [introData, setIntroData] = React.useState<IntroDataType[]>([]);
  const [browserName, setBrowserName] = React.useState<string>('');

  const navigate: NavigateFunction = useNavigate();

  const handleEndVideo = () => navigate('/demo');

  const fetchIntro: () => Promise<void> = async (): Promise<void> => {
    const { data: polls, error } = await supabase.from('polls').select('*');
    if (polls) {
      setIntroData(polls);
    }
    if (error) {
      toastAlert('error', 'Something went wrong');
    }
  };
  React.useEffect((): void => {
    fetchIntro();
  }, []);

  React.useEffect((): void => {
    const { userAgent } = window.navigator;
    let name: string = '';

    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
      name = 'Chrome';
    } else if (
      userAgent.indexOf('Safari') > -1 &&
      userAgent.indexOf('Chrome') === -1
    ) {
      name = 'Safari';
    } else if (userAgent.indexOf('Firefox') > -1) {
      name = 'Firefox';
    } else if (
      userAgent.indexOf('MSIE') > -1 ||
      userAgent.indexOf('Trident/') > -1
    ) {
      name = 'Internet Explorer';
    } else {
      name = 'Unknown';
    }

    setBrowserName(name);
  }, []);

  return (
    <Layout>
      <h6 className="text-center my-5 font-bold text-[22px]">Welcome</h6>
      {browserName === 'Safari' ? (
        <div className="flex items-center h-screen justify-center">
          <h5>Please open in Chrome Browser to run app</h5>
        </div>
      ) : (
        <>
          <VideoPlayer
            url={introData.length > 0 ? introData[0].demo_video : ''}
            handleEndVideo={handleEndVideo}
          />
          <h6 className="text-center mt-5 font-bold">
            {introData && introData[0]?.title}
          </h6>
        </>
      )}
    </Layout>
  );
};

export default React.memo(Home);
