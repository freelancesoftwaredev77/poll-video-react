// eslint-disable jsx-a11y/media-has-caption /
// eslint-disable @typescript-eslint/no-unsafe-argument /
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FiRefreshCw } from 'react-icons/fi';

interface IProps {
  blockFace: boolean;
  capturing: boolean;
  setCapturing: React.Dispatch<React.SetStateAction<boolean>>;
  isFinishedRecording: boolean;
  setIsFinishedRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordedChunks: React.Dispatch<React.SetStateAction<never[]>>;
  recordedChunks: never[];
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const WebcamDemoForIosDevices: React.FC<IProps> = ({
  blockFace,
  capturing,
  setCapturing,
  isFinishedRecording,
  setIsFinishedRecording,
  recordedChunks,
  setRecordedChunks,
  setStep,
  step,
}) => {
  const [cameraMode, setCameraMode] = React.useState('user');
  const [timer, setTimer] = useState(0);
  const webcamRef: any = React.useRef<Webcam | null>(null);

  const videoConstraints = {
    facingMode: cameraMode,
  };

  const mediaRecorderRef = useRef<any>(null);

  useEffect(() => {
    let intervalId: any;
    if (capturing) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer < 45 ? prevTimer + 1 : 45));
      }, 1000);
    } else {
      clearInterval(intervalId);
      setTimer(0);
    }

    return () => clearInterval(intervalId);
  }, [capturing]);

  const handleDataAvailable = ({ data }: { data: any }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  const handleStartCaptureClick = () => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream);
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  };

  const handleStopCaptureClick = () => {
    setCapturing(!capturing);
    setIsFinishedRecording(!isFinishedRecording);
    mediaRecorderRef.current?.stop();
    setStep(step + 1);
  };

  // console.log('Record chunks', recordedChunks);

  // const handleUpload = async () => {
  //   const blob = new Blob(recordedChunks, {
  //     type: 'video/webm',
  //   });

  //   const { data, error } = await supabase.storage
  //     .from('videos/uploads')
  //     .upload('new-added.mp4', blob);
  // };
  const handleSwitchCamera = () =>
    setCameraMode((prev) => (prev === 'user' ? 'environment' : 'user'));

  // userid + - + questionId

  return isFinishedRecording ? (
    <div className="relative">
      {/* {blockFace && (
        <div className="absolute left-[25%] top-20 z-30">
          <img src="/face-cover.png" alt="face-cover" className="z-30" />
        </div>
      )} */}
      <video
        autoPlay
        // ref={playerRef}
        className="h-full w-full rounded-xl object-cover"
        playsInline
        controlsList="nofullscreen nodownload"
        disablePictureInPicture
        disableRemotePlayback
        controls
        // onEnded={() => {
        //   setIsPaused(false);
        //   setShowControls(true);
        // }}
      >
        <source
          src={
            recordedChunks.length
              ? URL.createObjectURL(
                  new Blob(recordedChunks, { type: 'video/webm' })
                )
              : ''
          }
        />
        <source
          src={
            recordedChunks.length
              ? URL.createObjectURL(
                  new Blob(recordedChunks, { type: 'video/mp4' })
                )
              : ''
          }
        />
      </video>
      {/* <video
        controlsList="nofullscreen nodownload"
        playsInline
        disablePictureInPicture
        controls
        autoPlay
        className="h-full w-full"
        src={
          recordedChunks.length
            ? URL.createObjectURL(
                new Blob(recordedChunks, { type: 'video/webm' })
              )
            : ''
        }
      /> */}
    </div>
  ) : (
    <div className="relative">
      {blockFace && (
        <div className="absolute left-[25%] top-20">
          <img src="/face-cover.png" alt="face-cover" />
        </div>
      )}
      <Webcam
        ref={webcamRef}
        forceScreenshotSourceSize
        videoConstraints={videoConstraints}
        mirrored={false}
        audio
        className="h-full w-full"
        muted
      />
      {capturing ? (
        <button
          onClick={handleStopCaptureClick}
          className="absolute bottom-8 left-[40%]"
          aria-label="save"
        >
          <div className="h-16 w-16 rounded-full border-2 border-white">
            <div className="mx-auto mt-3 h-9 w-9 rounded-md bg-[#000000bb]" />
          </div>
        </button>
      ) : (
        <button
          onClick={handleStartCaptureClick}
          className="absolute bottom-8 left-[40%]"
          aria-label="save"
        >
          <div className="h-16 w-16 rounded-full border-2 border-white">
            <div className="mx-auto mt-1.5 h-12 w-12 rounded-full bg-warning" />
          </div>
        </button>
      )}

      {capturing && (
        <div className="absolute left-[50%] top-4 -translate-x-1/2 transform rounded-full bg-warning px-3 py-1 font-bold text-white">
          <p className="text-sm">00:{timer} / 45 sec</p>
        </div>
      )}
      {!capturing && (
        <button
          onClick={handleSwitchCamera}
          className="absolute bottom-8 right-10"
          aria-label="save"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00000080]">
            <FiRefreshCw color="#fff" className="hover:rotate-180" />
          </div>
        </button>
      )}
    </div>
  );
};

export default WebcamDemoForIosDevices;
