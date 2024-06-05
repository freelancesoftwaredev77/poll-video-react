/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import Webcam from 'react-webcam';
import { FiRefreshCw } from 'react-icons/fi';
import RecordRTC from 'recordrtc';

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
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('user');
  const [timer, setTimer] = useState(0);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
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
        setTimer((prevTimer) => (prevTimer < 45 ? prevTimer + 1 : 45));
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
        mimeType: 'video/webm;codecs=vp8',
        bitsPerSecond: 2 * 1024 * 1024,
        audioBitsPerSecond: 30000,
        videoBitsPerSecond: 50000,
      };

      try {
        recorderRef.current = new RecordRTC(stream, options);
        recorderRef?.current?.startRecording();
        setTimer(0);
      } catch (error) {
        setCapturing(false);
      }
    } else {
      alert('Webcam stream is not available');
    }
  };

  const captureThumbnail = (videoUrl: string) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.currentTime = 2; // Capture a frame 2 seconds into the video
    video.playsInline = true;
    video.muted = true;
    video.onloadeddata = () => {
      setTimeout(() => {
        // Ensure the video has rendered the frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/png');
        setThumbnail(thumbnailUrl);
      }, 500);
    };
    video.load();
  };

  const handleStopCaptureClick = () => {
    if (recorderRef.current) {
      try {
        recorderRef.current.stopRecording(() => {
          // @ts-ignore
          const recordedBlob: Blob = recorderRef.current.getBlob();
          if (recordedBlob.size > 0) {
            const videoUrl = URL.createObjectURL(recordedBlob);
            setRecordedChunks([...recordedChunks, recordedBlob]);
            captureThumbnail(videoUrl);
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

  return isFinishedRecording ? (
    <div
      className="relative h-[90%] cursor-pointer"
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      {recordedChunks.length > 0 ? (
        <video
          autoPlay={false}
          className="h-full w-full rounded-xl object-cover"
          playsInline
          controlsList="nodownload"
          disableRemotePlayback
          controls
          poster={thumbnail || undefined}
        >
          <source
            src={URL.createObjectURL(recordedChunks[recordedChunks.length - 1])}
            type="video/webm"
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
      {capturing ? (
        <div className="mt-5 flex items-center justify-center gap-3 text-secondary">
          <p>Apasă </p>
          <div className="h-7 w-7 rounded bg-warning" />
          <p>pentru înregistrare</p>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-center gap-3 text-secondary">
          <p>Apasă </p>
          <div className="h-7 w-7 rounded-full bg-warning" />
          <p>pentru a încheia</p>
        </div>
      )}
    </div>
  );
};

export default WebcamDemo;
