import * as React from 'react';
import ReactPlayer from 'react-player';
import { MdOutlineReplay } from 'react-icons/md';

interface IProps {
  url: any;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  isControl?: boolean;
  onEnded?: (end: boolean) => void;
}

const VideoPlayer: React.FC<IProps> = ({
  url,
  setIsPlaying,
  isControl = false,
  onEnded,
}) => {
  const [isPaused, setIsPaused] = React.useState(true);
  const [showControls, setShowControls] = React.useState(true);
  const [endVideo, setEndVideo] = React.useState(false);
  const playerRef = React.useRef<ReactPlayer>(null);

  const handleEndVideo = () => {
    onEnded?.(true);
    setEndVideo(true);
    setShowControls(true);
  };

  const handleControls: () => void = (): void => {
    setShowControls(true);
    setTimeout((): void => setShowControls(false), 2000);
  };

  const handlePlayPause: () => void = (): void => {
    if (setIsPlaying) {
      setIsPlaying(true);
    }
    if (isPaused) {
      setIsPaused(false);
      setShowControls(true);
      setTimeout((): void => setShowControls(false), 2000);
    } else {
      setIsPaused(true);
    }
  };

  const handleReplay: () => void = (): void => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      setIsPaused(false);
      setEndVideo(false);
      onEnded?.(false);
      setShowControls(true);
      setTimeout((): void => setShowControls(false), 3000);
    }
  };

  return (
    <div
      className="relative h-[100%]"
      role="button"
      tabIndex={0}
      aria-hidden="true"
      onClick={handleControls}
    >
      <ReactPlayer
        ref={playerRef}
        url={url ?? ''}
        playing={!isPaused}
        disablePictureInPicture
        className="custom-player !h-full !w-full"
        onEnded={handleEndVideo}
        playsinline
        controls={isControl}
        config={{
          file: { attributes: { controlsList: 'nodownload nofullscreen' } },
        }}
      />

      {showControls && (
        <div className="absolute left-[40%] top-[45%] z-50">
          {endVideo ? (
            <MdOutlineReplay size={50} color="#fff" onClick={handleReplay} />
          ) : isPaused ? (
            <button onClick={handlePlayPause} className="">
              {/* <FaPlayCircle color="#" width={100} /> */}
              {/* <img
                src="/play.png"
                alt="play-button"
                className="h-16 w-16 object-cover"
              /> */}
              <svg
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="45"
                  cy="45"
                  r="43.5"
                  fill="#fff"
                  fillOpacity="0.34"
                  stroke="#fff"
                  strokeWidth="3"
                />
                <path
                  d="M59.9165 44.6967C60.4557 45.0965 60.4557 45.9035 59.9165 46.3033L33.5956 65.8171C32.9356 66.3063 32 65.8353 32 65.0138L32 25.9862C32 25.1647 32.9356 24.6937 33.5956 25.1829L59.9165 44.6967Z"
                  fill="#D7005A"
                />
              </svg>
            </button>
          ) : (
            <button onClick={handlePlayPause}>
              {/* <img
                src="/pause.png"
                alt="pause-button"
                className="h-16 w-16 object-cover"
              /> */}

              <svg
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="45"
                  cy="45"
                  r="43.5"
                  fill="white"
                  fillOpacity="0.34"
                  stroke="white"
                  strokeWidth="3"
                />
                <rect
                  x="32"
                  y="25"
                  width="6"
                  height="41"
                  rx="3"
                  fill="#D7005A"
                />
                <rect
                  x="54"
                  y="25"
                  width="6"
                  height="41"
                  rx="3"
                  fill="#D7005A"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoPlayer);
