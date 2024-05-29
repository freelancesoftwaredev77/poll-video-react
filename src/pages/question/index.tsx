/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import {
  Link,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import { Footer, Layout } from '@/container';
import { Message, VideoBottomBar, VideoSkeleton } from '@/components';
import WebcamDemo from '@/components/web-cam-face-detection';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';
import useFetch from '@/hooks/useFetch';
import VideoPlayer from '@/components/video-player';

const Question: React.FC = () => {
  const { data: videoQuestions, isLoading } = useFetch('video_questions');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showRecordingScreen, setShowRecordingScreen] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [isFinishedRecording, setIsFinishedRecording] = React.useState(false);
  const [capture, setCapturing] = React.useState(false);
  const [blockface, setBlockFace] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const navigate: NavigateFunction = useNavigate();
  const { state } = useLocation();

  // const [showAlert, setShowAlert] = React.useState(false);

  // const handleOpenAlert = () => {
  //   setShowAlert(true);
  //   window.history.pushState(null, '', window.location.href);
  // };

  // const handleCloseAlert = () => {
  //   setShowAlert(false);
  //   window.history.back();
  // };

  React.useEffect(() => {
    if (!state?.userId) {
      navigate('/');
    }
  }, [navigate, state?.userId]);

  const handleNext = async () => {
    setIsSubmitting(true);
    const blob = new Blob(recordedChunks, {
      type: 'video/webm;codecs=vp8',
    });

    const { data: videoUploadResponse, error } = await supabase.storage
      .from('videos/uploads')
      .upload(`${uuidv1()}.webm`, blob);

    if (videoUploadResponse) {
      const { data: videoResponse, error: videoResponseError } = await supabase
        .from('video_responses')
        .insert([
          {
            // @ts-ignore
            response_video_url: videoUploadResponse?.fullPath,
            question_id: videoQuestions[currentIndex]?.id,
            user_id: state?.userId,
            should_block_face: blockface,
          },
        ])
        .select();

      if (videoResponseError) {
        toastAlert('error', 'Something went wrong');
      }

      if (videoResponse) {
        try {
          const data: Response = await fetch(
            `${import.meta.env.VITE_APP_API_BASE_URL}/video-transcribe/`,
            {
              method: 'POST',
              body: JSON.stringify({
                video_response_id: videoResponse[0]?.id,
              }),
            }
          );
          if (data?.status !== 200) {
            toastAlert('error', 'Something went wrong');
            setIsSubmitting(false);
          }
          if (data?.status === 200) {
            setIsSubmitting(false);
            setRecordedChunks([]);
            setCapturing(false);
            setShowRecordingScreen(false);
            setIsFinishedRecording(false);
            setStep(1);
            setIsSubmitting(false);
            setBlockFace(true);
            setIsPlaying(false);
            setCurrentIndex(
              (prevIndex: number) => (prevIndex + 1) % videoQuestions.length
            );
            if (currentIndex + 1 === videoQuestions?.length) {
              setIsCompleted(true);
            }
            setIsSubmitting(false);
          }
        } catch (err: any) {
          toastAlert('error', 'Something went wrong');
        }
      }
    }

    if (error) {
      toastAlert('error', 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  const handleShowRecordingScreen = () => {
    setShowRecordingScreen(!showRecordingScreen);
    setStep(step + 1);
  };

  const handleRecordAgain = () => {
    setRecordedChunks([]);
    setBlockFace(false);
    setIsFinishedRecording(!isFinishedRecording);
    setStep(step - 1);
  };

  const handleBlockFace = () => setBlockFace(!blockface);

  // React.useEffect(() => {
  //   window.addEventListener('popstate', handleOpenAlert);

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     window.removeEventListener('popstate', handleOpenAlert);
  //   };
  // }, []);

  return (
    <Layout>
      {isCompleted ? (
        <>
          <Message
            message="Sondajul a fost încheiat !"
            title="Felicitări !"
            imageUrl="/clap.png"
          />
          <Footer>
            <Link
              to="/terms-conditions"
              className="block text-center text-sm font-normal text-[blue]"
            >
              Terms and Conditions
            </Link>
          </Footer>
        </>
      ) : (
        <>
          <h1 className="mb-10 mt-5 text-[22px] font-bold text-primary">
            {`Întrebarea ${currentIndex + 1}`}
          </h1>

          {isLoading ? (
            <VideoSkeleton />
          ) : showRecordingScreen ? (
            <WebcamDemo
              blockFace={blockface}
              capturing={capture}
              setCapturing={setCapturing}
              isFinishedRecording={isFinishedRecording}
              setIsFinishedRecording={setIsFinishedRecording}
              recordedChunks={recordedChunks}
              setRecordedChunks={setRecordedChunks}
              step={step}
              setStep={setStep}
            />
          ) : (
            <VideoPlayer
              url={
                videoQuestions &&
                videoQuestions[currentIndex]?.question_video_url
              }
              setIsPlaying={setIsPlaying}
            />
          )}

          {/* {showAlert && (
            <Alert
              message="Sunteți sigur? Apăsarea din nou a butonului Înapoi va anula sondajul."
              onClose={handleCloseAlert}
            />
          )} */}

          <Footer>
            <VideoBottomBar
              blockface={blockface}
              capture={capture}
              handleBlockFace={handleBlockFace}
              handleNext={handleNext}
              handleRecordAgain={handleRecordAgain}
              handleShowRecordingScreen={handleShowRecordingScreen}
              step={step}
              isSubmitting={isSubmitting}
              isPlaying={isPlaying}
            />
          </Footer>
        </>
      )}
    </Layout>
  );
};

export default React.memo(Question);
