import * as React from 'react';
import ReactPlayer from 'react-player';
import { MdOutlineReplay } from 'react-icons/md';

interface IProps {
  url: string;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  isControl?: boolean;
}

const VideoPlayer: React.FC<IProps> = ({
  url,
  setIsPlaying,
  isControl = false,
}) => {
  const [isPaused, setIsPaused] = React.useState(true);
  const [showControls, setShowControls] = React.useState(true);
  const [endVideo, setEndVideo] = React.useState(false);
  const playerRef = React.useRef<ReactPlayer>(null);

  const handleEndVideo = () => {
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
        <div className="absolute left-[45%] top-[45%] z-50">
          {endVideo ? (
            <MdOutlineReplay size={50} color="#fff" onClick={handleReplay} />
          ) : isPaused ? (
            <button onClick={handlePlayPause}>
              <img
                src="/play.png"
                alt="play-button"
                className="h-16 w-16 object-cover"
              />
            </button>
          ) : (
            <button onClick={handlePlayPause}>
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
  );
};

export default React.memo(VideoPlayer);
