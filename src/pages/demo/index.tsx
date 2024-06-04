import * as React from 'react';
import {
  Link,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Footer, Layout } from '@/container';
import { VideoBottomBar, VideoPlayer } from '@/components';
import CompatibleWebcam from '@/components/web-cam-face-detection/web';

const Demo: React.FC = () => {
  const [showRecordingScreen, setShowRecordingScreen] =
    React.useState<boolean>(false);

  const [recordedChunks, setRecordedChunks] = React.useState<never[]>([]);
  const [isFinishedRecording, setIsFinishedRecording] =
    React.useState<boolean>(false);
  const [capture, setCapturing] = React.useState<boolean>(false);
  const [blockface, setBlockFace] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

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
    setBlockFace(true);
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
    <>
      <Layout>
        <div className="my-5 flex items-center justify-between">
          <h5 className="text-2xl font-bold text-primary">Întrebarea 1</h5>
          <Link
            className="rounded-md bg-violet px-4 py-1.5 text-sm text-white"
            to="/congratulation"
          >
            Închide demo
          </Link>
        </div>

        {showRecordingScreen ? (
          <CompatibleWebcam
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
            url={state?.instructionVideoUrl ?? ''}
            setIsPlaying={setIsPlaying}
          />
        )}
      </Layout>
      <Footer>
        <VideoBottomBar
          blockface={blockface}
          capture={capture}
          handleBlockFace={handleBlockFace}
          handleNext={handleNext}
          handleRecordAgain={handleRecordAgain}
          handleShowRecordingScreen={handleShowRecordingScreen}
          step={step}
          isPlaying={isPlaying}
        />
      </Footer>
    </>
  );
};

export default React.memo(Demo);
