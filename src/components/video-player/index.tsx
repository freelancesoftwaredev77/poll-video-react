import * as React from 'react';
import ReactPlayer from 'react-player';

interface IProps {
  url: string;
  handleEndVideo?: () => void;
}

const VideoPlayer: React.FC<IProps> = ({ url, handleEndVideo }) => {
  const [isPaused, setIsPaused] = React.useState(true);
  const [showControls, setShowControls] = React.useState(true);

  const handleControls: () => void = (): void => {
    setShowControls(true);
  };
  const handlePlayPause: () => void = (): void => {
    if (isPaused) {
      setIsPaused(false);
      setShowControls(true);
      setTimeout((): void => setShowControls(false), 2000);

      return;
    }
    setTimeout((): void => setShowControls(false), 2000);
    setIsPaused(true);
  };
  const handlePlay: () => void = (): void => {
    setTimeout((): void => setShowControls(false), 500);
    setIsPaused(true);
  };

  return (
    <div
      className="relative h-[78vh] rounded-lg"
      onClick={handleControls}
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      <ReactPlayer
        url={url}
        controls={false}
        playing={!isPaused}
        className="react-player"
        onEnded={handleEndVideo}
        style={{ paddingTop: '100%', width: '100%', maxWidth: '100%' }}
      />
      {showControls && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#000000b5] rounded-lg">
          <div className="absolute z-50 top-[45%] left-[45%]">
            {isPaused ? (
              <button onClick={handlePlayPause}>
                <img
                  src="/play.png"
                  alt="play-button"
                  className="w-16 h-16 object-cover"
                />
              </button>
            ) : (
              <button onClick={handlePlay}>
                <img
                  src="/pause.png"
                  alt="play-button"
                  className="w-16 h-16 object-cover"
                />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoPlayer);
