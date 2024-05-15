/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import { VideoQuestionType } from '@/types';
import { Footer, Layout } from '@/container';
import { VideoBottomBar, VideoSkeleton } from '@/components';
import WebcamDemo from '@/components/web-cam-face-detection';
import QuestionDisplay from '@/components/quesiton-display';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';

const Question: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showRecordingScreen, setShowRecordingScreen] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [isFinishedRecording, setIsFinishedRecording] = React.useState(false);
  const [capture, setCapturing] = React.useState(false);
  const [blockface, setBlockFace] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const navigate: NavigateFunction = useNavigate();
  const { state } = useLocation();

  const [videoQuestions, setVideoQuestion] = React.useState<
    VideoQuestionType[]
  >([]);

  const fetchQuestion = async () => {
    setIsLoading(true);
    const { data: videoQuestionResponse, error } = await supabase
      .from('video_questions')
      .select('*');

    if (videoQuestionResponse) {
      setIsLoading(false);
      setVideoQuestion(videoQuestionResponse);
    }
    if (error) {
      setIsLoading(false);
      toastAlert('error', 'Something went wrong.');
    }
  };

  React.useEffect(() => {
    fetchQuestion();
  }, []);

  React.useEffect(() => {
    if (!state?.userId) {
      navigate('/form');
    }
  }, [navigate, state?.userId]);

  const handleNext = async () => {
    setIsSubmitting(true);
    const blob = new Blob(recordedChunks, {
      type: 'video/webm',
    });

    const { data: videoUploadResponse, error } = await supabase.storage
      .from('videos/uploads')
      .upload(`${uuidv1()}.mp4`, blob);

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
            setBlockFace(false);
            setCurrentIndex(
              (prevIndex: number) => (prevIndex + 1) % videoQuestions.length
            );
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

  return (
    <Layout>
      <h1 className="text-primary text-[22px] font-bold mt-5 mb-10">
        {`Question ${currentIndex + 1}`}
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
        <QuestionDisplay
          questions={videoQuestions ?? []}
          currentIndex={currentIndex}
        />
      )}

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
        />
      </Footer>
    </Layout>
  );
};

export default React.memo(Question);
