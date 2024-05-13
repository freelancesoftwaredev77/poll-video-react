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

interface IProps {}

const Question: React.FC<IProps> = ({}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showRecordingScreen, setShowRecordingScreen] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [isFinishedRecording, setIsFinishedRecording] = React.useState(false);
  const [capture, setCapturing] = React.useState(false);
  const [blockface, SetBlockFace] = React.useState(false);
  const [step, setStep] = React.useState(1);

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

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex: number) => (prevIndex + 1) % videoQuestions.length
    );
  };

  const handleShowRecordingScreen = () => {
    setShowRecordingScreen(!showRecordingScreen);
    setStep(step + 1);
  };

  const handleRecordAgain = () => {
    setRecordedChunks([]);
    SetBlockFace(false);
    setIsFinishedRecording(!isFinishedRecording);
    setStep(step - 1);
  };

  const handleBlockFace = () => SetBlockFace(!blockface);

  // const handleNavigate = () => {};

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
    <Layout title={`Question ${currentIndex + 1}`}>
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
