/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import Webcam from 'react-webcam';
import { FiRefreshCw } from 'react-icons/fi';
import RecordRTC from 'recordrtc';

// Define the interface for the component's props
interface IProps {
  capturing: boolean;
  setCapturing: React.Dispatch<React.SetStateAction<boolean>>;
  isFinishedRecording: boolean;
  setIsFinishedRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordedChunks: React.Dispatch<React.SetStateAction<Blob[]>> | any;
  recordedChunks: Blob[];
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

// Define the functional component
const WebcamDemo: React.FC<IProps> = ({
  capturing,
  setCapturing,
  isFinishedRecording,
  setIsFinishedRecording,
  recordedChunks,
  setRecordedChunks,
  setStep,
  step,
}) => {
  // State to manage the camera mode
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('user');
  // State to manage the timer
  const [timer, setTimer] = useState(0);
  // State to manage the visibility of controls
  const [showControls, setShowControls] = useState(true);
  // Reference for the webcam
  const webcamRef: MutableRefObject<Webcam | null> = useRef<Webcam | null>(
    null
  );
  // Reference for the recorder
  const recorderRef: MutableRefObject<RecordRTC | null> =
    useRef<RecordRTC | null>(null);

  // Define video constraints
  const videoConstraints = {
    facingMode: cameraMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  // Effect to manage the timer
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

  // Start recording
  const handleStartCaptureClick = () => {
    if (webcamRef.current && webcamRef.current.stream) {
      setCapturing(true);
      const { stream } = webcamRef.current;

      const options: RecordRTC.Options = {
        type: 'video',
        mimeType: 'video/webm;codecs=vp8',
        bitsPerSecond: 2 * 1024 * 1024,
        audioBitsPerSecond: 30000,
        videoBitsPerSecond: 50000,
      };

      try {
        recorderRef.current = new RecordRTC(stream, options);
        recorderRef.current.startRecording();
        setTimer(0);
        setTimeout(() => {
          setShowControls(false);
        }, 2000);
      } catch (error) {
        setCapturing(false);
      }
    } else {
      alert('Webcam stream is not available');
    }
  };

  // Stop recording
  const handleStopCaptureClick = () => {
    if (recorderRef.current) {
      try {
        recorderRef.current.stopRecording(() => {
          // @ts-ignore
          const recordedBlob: Blob = recorderRef.current.getBlob();
          if (recordedBlob.size > 0) {
            setRecordedChunks([...recordedChunks, recordedBlob]);
          }
          // @ts-ignore
          recorderRef.current.reset();
          recorderRef.current = null;
          setCapturing(false);
          setIsFinishedRecording(true);
          setStep(step + 1);
        });
      } catch (error) {
        setCapturing(false);
      }
    }
  };

  useEffect(() => {
    if (timer >= 46) {
      handleStopCaptureClick();
    }
  }, [timer]);

  const handleSwitchCamera = () =>
    setCameraMode((prev) => (prev === 'user' ? 'environment' : 'user'));

  const handleVideoTap = () => {
    setShowControls((prev) => !prev);
  };

  return isFinishedRecording ? (
    <div
      className="relative h-[90%] cursor-pointer"
      role="button"
      tabIndex={0}
      aria-hidden
      onClick={handleVideoTap}
    >
      {recordedChunks.length > 0 ? (
        <video
          autoPlay
          className="h-full w-full rounded-xl object-cover"
          playsInline
          controls={showControls}
          controlsList="nodownload"
          disableRemotePlayback
          onEnded={() => {
            setShowControls(!showControls);
          }}
        >
          <source
            src={URL.createObjectURL(recordedChunks[recordedChunks.length - 1])}
            type="video/webm"
          />
          <source
            src={URL.createObjectURL(recordedChunks[recordedChunks.length - 1])}
            type="video/mp4"
          />
        </video>
      ) : (
        <p className="text-center font-semibold">
          Please open in a supported browser for recording preview features.
        </p>
      )}
    </div>
  ) : (
    <div className="relative h-[90%]">
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
                  <div className="h-16 w-16 rounded-full border-2 border-[#000000]">
                    <div className="mx-auto mt-4 h-7 w-7 rounded bg-warning" />
                  </div>
                </button>
              ) : (
                <button onClick={handleStartCaptureClick} aria-label="start">
                  <div className="h-16 w-16 rounded-full border-4 border-[#000000]">
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
      {capturing ? (
        <div className="mt-10 flex items-center justify-center gap-3 text-secondary">
          <p>Apasă </p>
          <div className="h-9 w-9 rounded-full border-2 border-[#000000]">
            <div className="mx-auto mt-1.5 h-5 w-5 rounded bg-warning" />
          </div>
          <p>pentru a încheia</p>
        </div>
      ) : (
        <div className="mt-10 flex items-center justify-center gap-3 text-secondary">
          <p>Apasă </p>
          <div className="h-9 w-9 rounded-full border-2 border-[#000000]">
            <div className="mx-auto mt-0.5 h-7 w-7 rounded-full bg-warning" />
          </div>
          <p>pentru înregistrare</p>
        </div>
      )}
    </div>
  );
};

export default WebcamDemo;
