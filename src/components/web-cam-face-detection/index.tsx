/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

const WebcamDemo: React.FC<IProps> = ({
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

  const calculateVideoDimensions = () => {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    return {
      width,
      height,
      aspectRatio: width / height,
    };
  };

  let videoConstraints = {
    facingMode: cameraMode,
    ...calculateVideoDimensions(),
  };

  useEffect(() => {
    const handleWindowResize = () => {
      if (!capturing) {
        videoConstraints = {
          facingMode: cameraMode,
          ...calculateVideoDimensions(),
        };
      }
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [capturing, cameraMode]);

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
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
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

  // const handleUpload = async () => {
  //   const blob = new Blob(recordedChunks, {
  //     type: 'video/webm',
  //   });

  //   const { data, error } = await supabase.storage
  //     .from('videos/uploads')
  //     .upload('new-added.mp4', blob);
  // };
  const handleSwitchCamera = () =>
    setCameraMode((prev: string): 'user' | 'environment' =>
      prev === 'user' ? 'environment' : 'user'
    );

  // userid + - + questionId

  return isFinishedRecording ? (
    <div className="relative">
      {blockFace && (
        <div className="absolute top-20 left-[25%] z-30">
          <img src="/face-cover.png" alt="face-cover" className="z-30" />
        </div>
      )}

      <video
        controlsList="nofullscreen nodownload"
        playsInline
        disablePictureInPicture
        controls
        autoPlay
        className="w-full h-full"
        src={
          recordedChunks.length
            ? URL.createObjectURL(
                new Blob(recordedChunks, { type: 'video/webm' })
              )
            : ''
        }
      />
    </div>
  ) : (
    <div className="relative ">
      {blockFace && (
        <div className="absolute top-20 left-[25%]">
          <img src="/face-cover.png" alt="face-cover" />
        </div>
      )}
      <Webcam
        ref={webcamRef}
        forceScreenshotSourceSize
        videoConstraints={videoConstraints}
        mirrored={false}
        audio
        muted
        className={capturing ? 'w-full h-full' : 'w-full'}
      />
      {capturing ? (
        <button
          onClick={handleStopCaptureClick}
          className="absolute bottom-8 left-[40%]"
        >
          <div className="border-white border-2 rounded-full w-16 h-16">
            <div className="bg-[#000000bb] h-9 w-9 rounded-md mx-auto mt-3" />
          </div>
        </button>
      ) : (
        <button
          onClick={handleStartCaptureClick}
          className="absolute bottom-8 left-[40%]"
        >
          <div className="border-white border-2 rounded-full w-16 h-16">
            <div className="bg-warning h-12 w-12 rounded-full mx-auto mt-1.5" />
          </div>
        </button>
      )}

      {capturing && (
        <div className="absolute top-4 left-[50%] transform -translate-x-1/2 bg-warning px-3 py-1 rounded-full text-white font-bold">
          <p className="text-sm">00:{timer} / 45 sec</p>
        </div>
      )}
      {!capturing && (
        <button
          onClick={handleSwitchCamera}
          className="absolute bottom-8 right-10"
        >
          <div className="bg-[#00000080] rounded-full w-12 h-12 flex items-center justify-center">
            <FiRefreshCw color="#fff" className="hover:rotate-180" />
          </div>
        </button>
      )}
    </div>
  );
};

export default WebcamDemo;
