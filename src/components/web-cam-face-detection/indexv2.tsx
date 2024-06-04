/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable jsx-a11y/media-has-caption */
// eslint-disable jsx-a11y/media-has-caption /
// eslint-disable @typescript-eslint/no-unsafe-argument /
import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  const [isPaused, setIsPaused] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const playerRef = React.useRef<any>(null);

  const videoConstraints = {
    facingMode: cameraMode,
  };

  const mediaRecorderRef = useRef<any>(null);

  const handleControls = () => {
    setShowControls(true);
    setTimeout(() => setShowControls(false), 2000);
  };

  const handlePlay = () => {
    if (isPaused) {
      playerRef?.current?.pause();
      setIsPaused(false);
      setShowControls(true);
      setTimeout(() => setShowControls(false), 2000);
    } else {
      playerRef?.current?.play();
      setIsPaused(true);
      setShowControls(true);
      setTimeout(() => setShowControls(false), 2000);
    }
  };

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

  const handleStopCaptureClick = useCallback(() => {
    setCapturing(!capturing);
    setIsFinishedRecording(!isFinishedRecording);
    mediaRecorderRef.current?.stop();
    setStep(step + 1);
  }, [
    capturing,
    isFinishedRecording,
    setCapturing,
    setIsFinishedRecording,
    setStep,
    step,
  ]);

  useEffect(() => {
    if (timer >= 46) {
      handleStopCaptureClick();
    }
  }, [handleStopCaptureClick, timer]);

  const handleSwitchCamera = () =>
    setCameraMode((prev) => (prev === 'user' ? 'environment' : 'user'));

  return isFinishedRecording ? (
    <div
      className="relative h-[90%] cursor-pointer"
      onClick={handleControls}
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      {blockFace && recordedChunks.length > 0 && (
        <div className="face-block">
          <img
            src="/face-cover.png"
            alt="face-cover"
            className="h-full w-full"
          />
        </div>
      )}
      <video
        autoPlay={false}
        ref={playerRef}
        className="h-full w-full rounded-xl object-cover"
        playsInline
        controlsList="nofullscreen nodownload"
        disablePictureInPicture
        disableRemotePlayback
        onEnded={() => {
          setIsPaused(false);
          setShowControls(true);
        }}
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
      {showControls && (
        <div className="controls absolute bottom-5 left-[40%] top-[45%]">
          {!isPaused ? (
            <button onClick={handlePlay} className="rounded-full bg-[black]">
              <img
                src="/play.png"
                alt="play-button"
                className="h-16 w-16 object-cover"
              />
            </button>
          ) : (
            <button onClick={handlePlay} className="rounded-full bg-[black]">
              <img
                src="/pause.png"
                alt="pause-button"
                className="h-16 w-16 object-cover"
              />
            </button>
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="relative h-[90%]">
      {blockFace && (
        <div className="face-block">
          <img
            src="/face-cover.png"
            alt="face-cover"
            className="h-full w-full"
          />
        </div>
      )}
      <Webcam
        ref={webcamRef}
        forceScreenshotSourceSize
        videoConstraints={videoConstraints}
        mirrored={false}
        audio
        className="h-full w-full object-cover"
        muted
      />
      <div className="absolute bottom-2 w-full px-4">
        <div>
          {capturing && (
            <p className="mx-auto w-28 rounded-full bg-warning px-3 py-1 text-center text-sm font-bold text-white">
              00:{timer < 10 ? `0${timer}` : timer} / 00:45
            </p>
          )}
          <div className="flex items-center justify-between gap-5">
            <div className="rounded-full px-3 py-1 font-bold text-white " />

            <div className="mt-3.5">
              {capturing ? (
                <button
                  onClick={handleStopCaptureClick}
                  aria-label="stop"
                  className={capturing ? 'mr-8' : ''}
                >
                  <div className="h-16 w-16 rounded-full border-2 border-white">
                    <div className="mx-auto mt-4 h-7 w-7 rounded bg-warning" />
                  </div>
                </button>
              ) : (
                <button onClick={handleStartCaptureClick} aria-label="start">
                  <div className="h-16 w-16 rounded-full border-4 border-white">
                    <div className="mx-auto mt-[1.3px] h-[54px] w-[54px] rounded-full bg-warning" />
                  </div>
                </button>
              )}
            </div>

            {!capturing ? (
              <button onClick={handleSwitchCamera} aria-label="switch camera">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00000080]">
                  <FiRefreshCw color="#fff" className="hover:rotate-180" />
                </div>
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamDemoForIosDevices;
