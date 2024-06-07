/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import {
  NavigateFunction,
  useBlocker,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import { Footer, Layout } from '@/container';
import { VideoBottomBar, VideoSkeleton } from '@/components';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';
import useFetch from '@/hooks/useFetch';
import VideoPlayer from '@/components/video-player';
import CompatibleWebcam from '@/components/web-cam-face-detection/web';

const Question: React.FC = () => {
  const { data: videoQuestions, isLoading } = useFetch('video_questions');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showRecordingScreen, setShowRecordingScreen] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [isFinishedRecording, setIsFinishedRecording] = React.useState(false);
  const [capture, setCapturing] = React.useState(false);
  const [blockface, setBlockFace] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [endVideo, setEndVideo] = React.useState(false);
  const navigate: NavigateFunction = useNavigate();
  const { state } = useLocation();

  React.useEffect(() => {
    if (!state?.userId) {
      navigate('/');
    }
  }, [navigate, state?.userId]);

  React.useEffect(() => {
    setEndVideo(false);
  }, [currentIndex]);

  const blocker = useBlocker(true);

  const handleNext = async () => {
    setIsSubmitting(true);
    const blob = new Blob(recordedChunks, {
      type: 'video/webm;codecs=vp8',
    });

    const { data: videoUploadResponse, error } = await supabase.storage
      .from('videos/uploads')
      .upload(`${uuidv1()}.webm`, blob);

    if (videoUploadResponse) {
      const { data: videoResponse, error: videoResponseError } = await supabase
        .from('video_responses')
        .insert([
          {
            // @ts-ignore
            response_video_url: videoUploadResponse?.fullPath,
            question_id: videoQuestions[currentIndex]?.id,
            user_id: state?.userId,
            should_block_face: blockface,
          },
        ])
        .select();

      if (videoResponseError) {
        alert(videoResponseError);
        toastAlert('error', videoResponseError.message);
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
            setIsPlaying(false);
            setCurrentIndex(
              (prevIndex: number) => (prevIndex + 1) % videoQuestions.length
            );
            if (currentIndex + 1 === videoQuestions?.length) {
              window.location.href = '/thank-you';
            }
            setIsSubmitting(false);
          }
        } catch (err: any) {
          toastAlert('error', err);
        }
      }
    }

    if (error) {
      toastAlert('error', error.message);
      setIsSubmitting(false);
    }
  };

  const handleShowRecordingScreen = () => {
    setShowRecordingScreen(!showRecordingScreen);
    setStep(step + 1);
  };

  const handleRecordAgain = () => {
    setRecordedChunks([]);
    setIsFinishedRecording(!isFinishedRecording);
    setStep(step - 1);
  };

  const handleBlockFace = () => setBlockFace(!blockface);

  return (
    <>
      <Layout>
        <>
          <h1 className="my-5 text-[22px] font-bold text-primary">
            {`Întrebarea ${currentIndex + 1}`}
          </h1>

          {isLoading ? (
            <VideoSkeleton />
          ) : showRecordingScreen ? (
            <CompatibleWebcam
              blockFace={blockface}
              capturing={capture}
              setCapturing={setCapturing}
              isFinishedRecording={isFinishedRecording}
              setIsFinishedRecording={setIsFinishedRecording}
              recordedChunks={recordedChunks}
              setRecordedChunks={setRecordedChunks}
              step={step}
              setStep={setStep}
            />
          ) : (
            <VideoPlayer
              url={
                videoQuestions &&
                videoQuestions[currentIndex]?.question_video_url
              }
              setIsPlaying={setIsPlaying}
              onEnded={(end) => setEndVideo(end)}
            />
          )}
        </>
      </Layout>
      <Footer>
        <VideoBottomBar
          blockface={blockface}
          capture={capture}
          handleBlockFace={handleBlockFace}
          handleNext={handleNext}
          handleRecordAgain={handleRecordAgain}
          handleShowRecordingScreen={handleShowRecordingScreen}
          step={step}
          isSubmitting={isSubmitting}
          isPlaying={isPlaying}
          hasEnded={endVideo}
        />
      </Footer>
      {blocker.state === 'blocked' ? (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-gray-500 fixed inset-0 bg-opacity-75 transition-opacity" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="bg-red-100 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="text-red-600 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        className="text-gray-900 text-base font-semibold leading-6"
                        id="modal-title"
                      >
                        Atenție!
                      </h3>
                      <div className="mt-2">
                        <p className="text-gray-500 text-sm">
                          Navigarea înapoi va șterge toate răspunsurile! Pentru
                          a continua apăsați “Continuă Sondajul”.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 flex flex-row justify-between px-2 py-3 md:px-12">
                  <button
                    type="button"
                    className="ring-gray-300 hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#D42ED8] shadow-sm sm:mt-0 sm:w-auto md:text-sm"
                    onClick={() => {
                      window.location.href = '/';
                    }}
                  >
                    ÎNCHIDE SONDAJUL
                  </button>
                  <button
                    type="button"
                    className="ring-gray-300 hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#D42ED8] shadow-sm sm:mt-0 sm:w-auto md:text-sm"
                    onClick={() => blocker.reset()}
                  >
                    CONTINUĂ SONDAJUL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default React.memo(Question);
