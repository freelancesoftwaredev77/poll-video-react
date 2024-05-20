/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
  setRecordedChunks?: React.Dispatch<React.SetStateAction<never[]>> | any;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isDemo?: boolean;
  isSubmitting?: boolean;
  setIsSubmitting?: any;
  recordedChunks?: never[];
  setCurrentIndex?: any;
  userId?: string;
  questionId?: number;
  questionLength?: number | any;
  currentIdx?: number | any;
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
  currentIdx,
}) => {
  const [cameraMode, setCameraMode] = React.useState('user');
  const navigate: NavigateFunction = useNavigate();
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
    const newRecordedData: any = [];
    if (data.size > 0) {
      newRecordedData.push(data);
    }
    // @ts-ignore
    return setRecordedChunks(newRecordedData);
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

  const handleStopCaptureClick = async () => {
    if (isDemo) {
      navigate('/congratulation');
    } else {
      setCapturing(!capturing);
      setIsFinishedRecording(!isFinishedRecording);
      mediaRecorderRef.current?.stop();
      setStep(step + 1);

      setIsSubmitting(true);

      const inputBlob = new Blob(recordedChunks, {
        type: 'video/x-matroska;codecs=avc1,opus',
      });

      const fileName = `${uuidv1()}.mp4`;

      const { data: videoUploadResponse, error } = await supabase.storage
        .from('videos/uploads')
        .upload(fileName, inputBlob);

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
            const data: Response = await fetch(
              `${import.meta.env.VITE_APP_API_BASE_URL}/video-transcribe/`,
              {
                method: 'POST',
                body: JSON.stringify({
                  video_response_id: videoResponse[0]?.id,
                }),
              }
            );
            if (data?.status !== 200) {
              toastAlert('error', 'Something went wrong');
              setIsSubmitting(false);
            }
            if (data?.status === 200) {
              setIsSubmitting(false);
              setRecordedChunks([]);
              setCapturing(false);
              setShowRecordingScreen(false);
              setIsFinishedRecording(false);
              setStep(1);
              setIsSubmitting(false);
              setBlockFace(false);
              // if()
              setCurrentIndex(
                (prevIndex: number) => (prevIndex + 1) % questionLength
              );
              setIsSubmitting(false);
              console.log('current index', currentIdx);
            }
          } catch (err: any) {
            toastAlert('error', 'Something went wrong');
          }
        }
      }

      if (error) {
        toastAlert('error', 'Something went wrong');
        setIsSubmitting(false);
      }
      setIsSubmitting(false);
    }
  };

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
      {capturing ? (
        <button
          onClick={handleStopCaptureClick}
          className="absolute bottom-8 left-[40%]"
          aria-label="save"
        >
          <div className="border-white border-2 rounded-full w-16 h-16">
            <div className="bg-[#000000bb] h-9 w-9 rounded-md mx-auto mt-3" />
          </div>
        </button>
      ) : (
        <button
          onClick={handleStartCaptureClick}
          className="absolute bottom-8 left-[40%]"
          aria-label="save"
        >
          <div className="border-white border-2 rounded-full w-16 h-16">
            <div className="bg-warning h-12 w-12 rounded-full mx-auto mt-1.5" />
          </div>
        </button>
      )}

      {capturing && (
        <div className="absolute bottom-12 left-[20%] transform -translate-x-1/2 bg-warning px-3 py-1 rounded-full text-white font-bold">
          <p className="text-sm">00:{timer} / 45 sec</p>
        </div>
      )}
      {!capturing && (
        <button
          onClick={handleSwitchCamera}
          className="absolute bottom-8 right-10"
          aria-label="save"
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
