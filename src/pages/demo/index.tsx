import * as React from 'react';
import { IoVideocamOutline } from 'react-icons/io5';
import { Footer, Layout } from '@/container';
import { Button, VideoPlayer } from '@/components';
import WebcamDemo from '@/components/web-cam-face-detection';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { IoIosPlay } from 'react-icons/io';

interface IProps {}

const Question: React.FC<IProps> = ({}) => {
  // const [isLoading, setIsLoading] = React.useState(false);
  const [showRecordingScreen, setShowRecordingScreen] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [isFinishedRecording, setIsFinishedRecording] = React.useState(false);
  const [capture, setCapturing] = React.useState(false);
  const [blockface, setBlockFace] = React.useState(false);
  const [step, setStep] = React.useState(1);

  const navigate: NavigateFunction = useNavigate();

  const handleNext = () => navigate('/congratulation');

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
          <div className="flex items-center gap-4">
            <Button
              text="Start Poll"
              type="submit"
              variant="primary"
              icon={<IoIosPlay size={20} color="#fff" />}
              className="px-4 py-2"
              hasIcon
              onClick={handleNext}
            />
            <Button
              text="Demo"
              type="button"
              variant="outline"
              icon={<IoVideocamOutline size={20} color="#fff" />}
              className="px-4 py-2"
              hasIcon
              onClick={handleShowRecordingScreen}
            />
          </div>
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
    <Layout>
      {step === 1 && (
        <h5 className="text-center text-2xl font-bold mt-5 mb-10">
          Instruction
        </h5>
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
      <Footer>{renderBottomNavigation()}</Footer>
    </Layout>
  );
};

export default React.memo(Question);
