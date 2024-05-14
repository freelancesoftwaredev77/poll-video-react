import * as React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '@/components';
import { Layout } from '@/container';
import { IntroDataType } from '@/types';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';

interface IProps {}

const Home: React.FC<IProps> = ({}) => {
  const [introData, setIntroData] = React.useState<IntroDataType[]>([]);
  const navigate: NavigateFunction = useNavigate();

  const handleEndVideo = () => navigate('/demo');

  const fetchIntro = async () => {
    const { data: polls, error } = await supabase.from('polls').select('*');
    if (polls) {
      setIntroData(polls);
    }
    if (error) {
      toastAlert('error', 'Something went wrong');
    }
  };
  React.useEffect(() => {
    fetchIntro();
  }, []);

  return (
    <Layout>
      <h6 className="text-center my-5 font-bold text-[22px]">Welcome</h6>

      <VideoPlayer
        url={introData.length > 0 ? introData[0].demo_video : ''}
        handleEndVideo={handleEndVideo}
      />
      <h6 className="text-center mt-5 font-bold">
        {introData && introData[0]?.title}
      </h6>
    </Layout>
  );
};

export default React.memo(Home);
