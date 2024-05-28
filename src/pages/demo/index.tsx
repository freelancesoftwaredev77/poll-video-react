import * as React from 'react';
import {
  Link,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom';
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

  const { state } = useLocation();

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

  React.useEffect(() => {
    if (!state?.instructionVideoUrl) {
      navigate('/');
    }
  }, [navigate, state?.instructionVideoUrl]);

  return (
    <Layout>
      <div className="flex items-center justify-between mt-5 mb-10">
        <h5 className="text-primary text-2xl font-bold">Întrebarea 1</h5>
        <Link
          className="bg-violet px-4 py-1.5 rounded-xl text-white font-bold"
          to="/congratulation"
        >
          Exit demo
        </Link>
      </div>

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
        <VideoPlayer url={state?.instructionVideoUrl ?? ''} />
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
        />
      </Footer>
    </Layout>
  );
};

export default React.memo(Demo);
