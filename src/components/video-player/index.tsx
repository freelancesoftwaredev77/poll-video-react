/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import ReactPlayer from 'react-player';
import Spinner from '../spinner';

interface IProps {
  url: string;
  handleEndVideo?: () => void;
}

const VideoPlayer: React.FC<IProps> = ({ url, handleEndVideo }) => {
  const [loading, setLoading] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false); // Autoplay by default
  const [showControls, setShowControls] = React.useState(false);

  const handleControls = () => {
    setShowControls(true);
  };

  const handlePlayPause = () => {
    setIsPaused((prevPaused) => !prevPaused);
    setShowControls(true);
  };

  const handleBuffer = () => setLoading(true);
  const handleBufferEnd = () => setLoading(false);

  return (
    <div className="relative h-[78vh] rounded-lg" onClick={handleControls}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Spinner variant="large" align="center" />
        </div>
      )}
      <ReactPlayer
        url={url}
        controls={false}
        onBuffer={handleBuffer}
        playing={!isPaused} // Autoplay if !isPaused
        onBufferEnd={handleBufferEnd}
        className="react-player"
        onEnded={handleEndVideo}
        style={{ paddingTop: '100%', width: '100%', maxWidth: '100%' }}
      />
      {showControls && !loading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#000000b5] rounded-lg">
          <div className="absolute z-50 top-[45%] left-[45%]">
            <button onClick={handlePlayPause}>
              <img
                src={isPaused ? '/play.png' : '/pause.png'} // Toggle play/pause icon
                alt="play-button"
                className="w-16 h-16 object-cover"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoPlayer);
