/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useRef, useState, useEffect } from 'react';
import { v1 as uuidv1 } from 'uuid';
import Webcam from 'react-webcam';
import { FiRefreshCw } from 'react-icons/fi';
import Spinner from '../spinner';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';

interface IProps {
  blockFace: boolean;
  capturing: boolean;
  setCapturing: React.Dispatch<React.SetStateAction<boolean>>;
  isFinishedRecording: boolean;
  setIsFinishedRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setBlockFace: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRecordingScreen?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setRecordedChunks?: React.Dispatch<React.SetStateAction<Blob[]>> | any;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isDemo?: boolean;
  isSubmitting?: boolean;
  setIsSubmitting?: any;
  recordedChunks?: Blob[];
  setCurrentIndex?: any;
  userId?: string;
  questionId?: number;
  questionLength?: number | any;
}

const WebcamDemo: React.FC<IProps> = ({
  blockFace,
  capturing,
  setCapturing,
  isFinishedRecording,
  setIsFinishedRecording,
  setRecordedChunks,
  setStep,
  step,
  isDemo,
  isSubmitting,
  setIsSubmitting,
  recordedChunks,
  setCurrentIndex,
  userId,
  setBlockFace,
  setShowRecordingScreen,
  questionId,
  questionLength,
}) => {
  const [cameraMode, setCameraMode] = useState('user');
  const navigate: NavigateFunction = useNavigate();
  const [timer, setTimer] = useState(0);
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const videoConstraints = {
    facingMode: cameraMode,
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

  const handleDataAvailable = (event: { data: Blob }) => {
    if (event.data && event.data.size > 0) {
      setRecordedChunks((prev: any) => [...prev, event.data]);
    }
  };

  const handleStartCaptureClick = () => {
    if (webcamRef.current && webcamRef.current.stream) {
      setCapturing(true);
      setRecordedChunks([]);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm',
      });
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorderRef.current.start(100);
    }
  };

  const handleStopCaptureClick = async () => {
    setCapturing(false);
    setIsFinishedRecording(true);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (isDemo) {
      return navigate('/congratulation');
    }
    setStep(step + 1);
    setIsSubmitting(true);

    setTimeout(async () => {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });

      if (blob.size === 0) {
        setIsSubmitting(false);
        return;
      }

      const { data: videoUploadResponse, error } = await supabase.storage
        .from('videos/uploads')
        .upload(`${uuidv1()}.webm`, blob);

      if (videoUploadResponse) {
        const { data: videoResponse, error: videoResponseError } =
          await supabase
            .from('video_responses')
            .insert([
              {
                // @ts-ignore
                response_video_url: videoUploadResponse?.fullPath,
                question_id: questionId,
                user_id: userId,
                should_block_face: blockFace,
              },
            ])
            .select();

        if (videoResponseError) {
          toastAlert('error', 'Something went wrong');
        }

        if (videoResponse) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_APP_API_BASE_URL}/video-transcribe/`,
              {
                method: 'POST',
                body: JSON.stringify({
                  video_response_id: videoResponse[0]?.id,
                }),
              }
            );

            if (response.status !== 200) {
              toastAlert('error', 'Something went wrong');
              setIsSubmitting(false);
            } else {
              setIsSubmitting(false);
              setRecordedChunks([]);
              setCapturing(false);
              setShowRecordingScreen(false);
              setIsFinishedRecording(false);
              setStep(1);
              setBlockFace(false);
              setCurrentIndex(
                (prevIndex: number) => (prevIndex % questionLength) + 1
              );
            }
          } catch (err) {
            toastAlert('error', 'Something went wrong');
          }
        }
      }

      if (error) {
        toastAlert('error', 'Something went wrong');
        setIsSubmitting(false);
      }
    }, 1000);
  };
  React.useEffect(() => {
    if (timer >= 46) {
      handleStopCaptureClick();
    }
  }, [timer]);

  const handleSwitchCamera = () =>
    setCameraMode((prev) => (prev === 'user' ? 'environment' : 'user'));

  return isFinishedRecording ? (
    <div className="h-[90%] flex items-center justify-center flex-col">
      {isSubmitting && (
        <>
          <Spinner variant="large" align="center" />
          <p className="mt-4 text-xs text-primary">
            Please wait video is uploading...
          </p>
        </>
      )}
    </div>
  ) : (
    <div className="relative h-[90%]">
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
        className="w-full h-full object-cover"
        muted
      />
      <div className="absolute bottom-10 w-full px-4">
        <div className="flex items-center justify-between gap-5">
          {/* {capturing && ( */}

          {capturing ? (
            <div className="bg-warning px-3 py-1 rounded-full text-white font-bold ">
              <p className="text-sm">00:{timer} / 00:45</p>
            </div>
          ) : (
            <div className="" />
          )}
          <div className={capturing ? 'mr-[2rem]' : ''}>
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
          {/* )} */}

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
