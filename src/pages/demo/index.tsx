import * as React from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { Footer, Layout } from '@/container';
import { VideoBottomBar, VideoPlayer } from '@/components';
import WebcamDemo from '@/components/web-cam-face-detection';

const Demo: React.FC = () => {
  const [showRecordingScreen, setShowRecordingScreen] =
    React.useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = React.useState<never[]>([]);
  const [isFinishedRecording, setIsFinishedRecording] =
    React.useState<boolean>(false);
  const [capture, setCapturing] = React.useState<boolean>(false);
  const [blockface, setBlockFace] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<number>(1);

  const navigate: NavigateFunction = useNavigate();

  const handleNext = (): void => navigate('/congratulation');

  const handleShowRecordingScreen = (): void => {
    setShowRecordingScreen(!showRecordingScreen);
    setStep(step + 1);
  };

  const handleRecordAgain = (): void => {
    setRecordedChunks([]);
    setBlockFace(false);
    setIsFinishedRecording(!isFinishedRecording);
    setStep(step - 1);
  };

  const handleBlockFace = (): void => setBlockFace(!blockface);

  return (
    <Layout>
      {step === 1 ? (
        <h5 className="text-center text-2xl font-bold mt-5 mb-10">
          Instruction
        </h5>
      ) : (
        <div className="flex items-center justify-between mt-5 mb-10">
          <h5 className="text-primary text-2xl font-bold">Demo</h5>
          <Link
            className="bg-violet px-4 py-1.5 rounded-xl text-white font-bold"
            to="/congratulation"
          >
            Exit demo
          </Link>
        </div>
      )}
      {showRecordingScreen ? (
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
        <VideoPlayer url="https://cdn.pixabay.com/video/2023/07/10/171007-844433279_large.mp4" />
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
          isDemo
        />
      </Footer>
    </Layout>
  );
};

export default React.memo(Demo);
