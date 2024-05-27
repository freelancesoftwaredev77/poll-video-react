/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import Webcam from 'react-webcam';
import { FiRefreshCw } from 'react-icons/fi';
import VideoPlayer from '../video-player';

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

  const videoConstraints = {
    facingMode: cameraMode,
  };

  const mediaRecorderRef: MutableRefObject<any> = useRef<any>(null);

  useEffect(() => {
    let intervalId: any;
    if (capturing) {
      intervalId = setInterval(() => {
        setTimer((prevTimer: number) => (prevTimer < 45 ? prevTimer + 1 : 45));
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
    if (webcamRef.current && webcamRef.current.stream) {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm;codecs=vp8',
      });
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    } else {
      console.error('Webcam stream is not available');
    }
  };

  const handleStopCaptureClick = () => {
    setCapturing(!capturing);
    setIsFinishedRecording(!isFinishedRecording);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setStep(step + 1);
  };

  useEffect(() => {
    if (timer >= 46) {
      handleStopCaptureClick();
    }
  }, [timer]);

  const handleSwitchCamera = () =>
    setCameraMode((prev: string): 'user' | 'environment' =>
      prev === 'user' ? 'environment' : 'user'
    );

  return isFinishedRecording ? (
    <div className="relative h-[90%]">
      {blockFace && (
        <div className="absolute top-20 left-[25%] z-30">
          <img src="/face-cover.png" alt="face-cover" className="z-30" />
        </div>
      )}

      <VideoPlayer
        url={
          recordedChunks.length
            ? URL.createObjectURL(
                new Blob(recordedChunks, { type: 'video/webm' })
              )
            : ''
        }
        isControl
      />
    </div>
  ) : (
    <div className="relative h-[90%]">
      {blockFace && (
        <div className="absolute top-20 left-[25%] z-[99]">
          <img src="/face-cover.png" alt="face-cover" />
        </div>
      )}
      <Webcam
        ref={webcamRef}
        forceScreenshotSourceSize
        videoConstraints={videoConstraints}
        mirrored={false}
        audio
        className="w-full h-full object-cover"
        muted
      />
      <div className="absolute bottom-10 w-full px-4">
        <div className="flex items-center justify-between gap-5">
          {capturing ? (
            <div className="bg-warning px-3 py-1 rounded-full text-white font-bold ">
              <p className="text-sm">00:{timer} / 00:45</p>
            </div>
          ) : (
            <div className=" px-3 py-1 rounded-full text-white font-bold " />
          )}
          <div className={capturing ? 'mr-20' : 'ml-6'}>
            {capturing ? (
              <button
                onClick={handleStopCaptureClick}
                className=""
                aria-label="save"
              >
                <div className="border-white border-2 rounded-full w-16 h-16">
                  <div className="bg-[#000000bb] h-9 w-9 rounded-md mx-auto mt-3" />
                </div>
              </button>
            ) : (
              <button
                onClick={handleStartCaptureClick}
                className=""
                aria-label="save"
              >
                <div className="border-white border-2 rounded-full w-16 h-16">
                  <div className="bg-warning h-12 w-12 rounded-full mx-auto mt-1.5" />
                </div>
              </button>
            )}
          </div>

          {!capturing ? (
            <button onClick={handleSwitchCamera} className="" aria-label="save">
              <div className="bg-[#00000080] rounded-full w-12 h-12 flex items-center justify-center">
                <FiRefreshCw color="#fff" className="hover:rotate-180" />
              </div>
            </button>
          ) : (
            <div className="" />
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamDemo;
