/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import Webcam from 'react-webcam';
import { FiRefreshCw } from 'react-icons/fi';
import RecordRTC from 'recordrtc';

interface IProps {
  blockFace: boolean;
  capturing: boolean;
  setCapturing: React.Dispatch<React.SetStateAction<boolean>>;
  isFinishedRecording: boolean;
  setIsFinishedRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordedChunks: React.Dispatch<React.SetStateAction<Blob[]>> | any;
  recordedChunks: Blob[];
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
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('user');
  const [timer, setTimer] = useState(0);
  const webcamRef: MutableRefObject<Webcam | null> = useRef<Webcam | null>(
    null
  );
  const recorderRef: MutableRefObject<RecordRTC | null> =
    useRef<RecordRTC | null>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const playerRef = React.useRef<any>(null);
  const videoConstraints = {
    facingMode: cameraMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  const handleControls = () => {
    setShowControls(true);
    setTimeout((): void => setShowControls(false), 2000);
  };

  const handlePlay = () => {
    if (isPaused) {
      playerRef?.current?.pause();
      setIsPaused(false);
      setShowControls(true);
      setTimeout((): void => setShowControls(false), 2000);
    } else {
      playerRef?.current?.play();
      setIsPaused(true);
      setShowControls(true);
      setTimeout((): void => setShowControls(false), 2000);
    }
  };

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

  const handleStartCaptureClick = () => {
    if (webcamRef.current && webcamRef.current.stream) {
      setCapturing(true);
      const { stream } = webcamRef.current;

      const options: RecordRTC.Options = {
        type: 'video',
        mimeType: 'video/webm;codecs=vp9',
        bitsPerSecond: 2 * 1024 * 1024,
        audioBitsPerSecond: 30000,
        videoBitsPerSecond: 50000,
      };

      recorderRef.current = new RecordRTC(stream, options);
      recorderRef.current.startRecording();
      setTimer(0);
    } else {
      alert('Webcam stream is not available');
    }
  };

  const handleStopCaptureClick = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        // @ts-ignore
        const recordedBlob = recorderRef.current.getBlob();
        if (recordedBlob.size > 0) {
          setRecordedChunks([...recordedChunks, recordedBlob]);
        } else {
          console.error('Recorded blob is empty');
        }
        // @ts-ignore
        recorderRef.current.reset();
        recorderRef.current = null;
        setCapturing(false);
        setIsFinishedRecording(true);
        setStep(step + 1);
      });
    }
  };

  useEffect(() => {
    if (timer >= 46) {
      handleStopCaptureClick();
    }
  }, [timer]);

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
      {recordedChunks?.length > 0 && blockFace && (
        <div className="center">
          <img src="/face-cover.png" alt="face-cover" className="w-[250px]" />
        </div>
      )}
      {recordedChunks.length > 0 ? (
        <video
          autoPlay={false}
          ref={playerRef}
          className="h-full w-full rounded-xl object-cover"
          playsInline
          controlsList="nofullscreen | nodownload"
          disablePictureInPicture
          disableRemotePlayback
          onEnded={() => {
            setIsPaused(false);
            setShowControls(true);
          }}
        >
          <source
            src={URL.createObjectURL(recordedChunks[recordedChunks.length - 1])}
            type="video/mp4"
          />
          <source
            src={URL.createObjectURL(recordedChunks[recordedChunks.length - 1])}
            type="video/webm"
          />
        </video>
      ) : (
        <p className="text-center font-semibold">
          Please Open in safari browser for this feature
        </p>
      )}
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
        <div className="center z-[99999]">
          <img
            src="/face-cover.png"
            alt="face-cover"
            className="w-[250px] object-cover"
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

export default WebcamDemo;
