/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { IoVideocamOutline } from 'react-icons/io5';
import { Footer, Layout } from '@/container';
import { Button, VideoSkeleton } from '@/components';
import WebcamDemo from '@/components/web-cam-face-detection';
import QuestionDisplay from '@/components/quesiton-display';
import { supabase } from '@/utils/supabase';
import { VideoQuestionType } from '@/types';
import toastAlert from '@/utils/toastAlert';
import { v1 as uuidv1 } from 'uuid';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

interface IProps {}

const Question: React.FC<IProps> = ({}) => {
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
            //@ts-ignore
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

  const renderBottomNavigation = () => {
    switch (step) {
      case 1:
        return (
          <Button
            text="Record"
            type="button"
            variant="primary"
            icon={<IoVideocamOutline size={20} color="#fff" />}
            className="px-4 py-2"
            hasIcon
            onClick={handleShowRecordingScreen}
          />
        );

      case 2:
        return (
          <Button
            text={blockface ? 'Block your face' : 'unblock your face'}
            type="button"
            isValid={!capture}
            variant="outline"
            className="px-4 py-2"
            onClick={handleBlockFace}
          />
        );

      case 3:
        return (
          <div className="flex items-center gap-3">
            <Button
              text="Record Again"
              type="button"
              variant="primary"
              icon={<IoVideocamOutline size={20} color="#fff" />}
              className="px-4 py-2"
              hasIcon
              onClick={handleRecordAgain}
            />
            <Button
              text="Next"
              type="button"
              variant="outline"
              icon={<IoVideocamOutline size={20} color="#fff" />}
              className="px-4 py-2"
              hasIcon
              onClick={handleNext}
              isSubmitting={isSubmitting}
            />
          </div>
        );

      default:
        return (
          <Button
            text="Record"
            type="button"
            variant="primary"
            icon={<IoVideocamOutline size={20} color="#fff" />}
            className="px-4 py-2"
            hasIcon
            onClick={handleShowRecordingScreen}
          />
        );
    }
  };
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

      <Footer>{renderBottomNavigation()}</Footer>
    </Layout>
  );
};

export default React.memo(Question);
