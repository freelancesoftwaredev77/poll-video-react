/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
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

  const videoConstraints = {
    facingMode: cameraMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
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
    <div className="relative h-[90%]">
      {blockFace && (
        <div className="absolute top-20 left-[25%] z-[99999]">
          <img src="/face-cover.png" alt="face-cover" className="z-30" />
        </div>
      )}
      {recordedChunks.length > 0 ? (
        <video
          controls
          autoPlay
          className="w-full h-full object-cover"
          playsInline
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
        <p>No video recorded</p>
      )}
    </div>
  ) : (
    <div className="relative h-[90%]">
      {blockFace && (
        <div className="absolute top-20 left-[25%] z-[99999]">
          <img src="/face-cover.png" alt="face-cover" className="" />
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
              <p className="text-sm">
                00:{timer < 10 ? `0${timer}` : timer} / 00:45
              </p>
            </div>
          ) : (
            <div className=" px-3 py-1 rounded-full text-white font-bold " />
          )}
          <div className={capturing ? 'mr-20' : 'ml-6'}>
            {capturing ? (
              <button
                onClick={handleStopCaptureClick}
                className=""
                aria-label="stop"
              >
                <div className="border-white border-2 rounded-full w-16 h-16">
                  <div className="bg-[#000000bb] h-9 w-9 rounded-md mx-auto mt-3" />
                </div>
              </button>
            ) : (
              <button
                onClick={handleStartCaptureClick}
                className=""
                aria-label="start"
              >
                <div className="border-white border-2 rounded-full w-16 h-16">
                  <div className="bg-warning h-12 w-12 rounded-full mx-auto mt-1.5" />
                </div>
              </button>
            )}
          </div>

          {!capturing ? (
            <button
              onClick={handleSwitchCamera}
              className=""
              aria-label="switch camera"
            >
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
