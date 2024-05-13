/* eslint-disable jsx-a11y/click-events-have-key-events */

import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactPlayer from 'react-player';
import Spinner from '../spinner';

interface IProps {
  url: string;
}

const CustomPlayer: React.FC<IProps> = ({ url }) => {
  const [loading, setLoading] = React.useState(true);

  const [isPaused, setIsPaused] = React.useState(true);

  const [showControls, setShowControls] = React.useState(false);

  const handleControls: () => void = (): void => {
    setShowControls(true);
  };
  const handlePlayPause: () => void = (): void => {
    if (isPaused) {
      setIsPaused(false);
      setShowControls(true);
      return;
    }
    setTimeout((): void => setShowControls(false), 2000);
    setIsPaused(true);
  };
  const handlePlay: () => void = (): void => {
    setTimeout((): void => setShowControls(false), 500);
    setIsPaused(true);
  };

  const handleBuffer = () => setLoading(true);

  const handleBufferEnd = () => setLoading(false);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="relative"
      onClick={handleControls}
      style={{ position: 'relative', width: '100% !important', zIndex: 2 }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner variant="large" align="center" />
        </div>
      )}
      <ReactPlayer
        url={url}
        controls={false}
        onBuffer={handleBuffer}
        playing={isPaused}
        onBufferEnd={handleBufferEnd}
        className="react-player"
        style={{ paddingTop: '100%', width: '100%', maxWidth: '100%' }}
      />
      {showControls && !loading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#000000b5] rounded-lg">
          <div className="absolute z-50 top-[45%] left-[45%]">
            {!isPaused ? (
              <button onClick={handlePlay}>
                <img
                  src="/play.png"
                  alt="play-button"
                  className="w-16 h-16 object-cover"
                />
              </button>
            ) : (
              <button onClick={handlePlayPause}>
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

export default React.memo(CustomPlayer);
