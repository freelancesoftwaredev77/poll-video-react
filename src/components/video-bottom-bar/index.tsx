import React from 'react';
import Button from '../button';
import { IoVideocamOutline } from 'react-icons/io5';

interface IProps {
  handleNext: () => void;
  handleShowRecordingScreen: () => void;
  handleBlockFace: () => void;
  handleRecordAgain: () => void;
  blockface: boolean;
  capture: boolean;
  step: number;
  isSubmitting?: boolean;
  isPlaying?: boolean;
  hasEnded?: boolean;
}

const VideoBottomBar: React.FC<IProps> = ({
  handleNext,
  handleShowRecordingScreen,
  // blockface,
  step,
  // capture,
  // handleBlockFace,
  handleRecordAgain,
  isSubmitting,
  hasEnded,
}) => {
  const renderBottomNavigation = () => {
    switch (step) {
      case 1:
        return hasEnded ? (
          <Button
            text="Răspunde"
            type="button"
            variant="primary"
            className="px-4 py-2"
            onClick={handleShowRecordingScreen}
          />
        ) : (
          <div />
        );
      case 2: {
        // TODO: temporarily disable the block face
        // return !capture ? (
        //   <Button
        //     text={!blockface ? 'Acoperă fața' : 'Descoperă fața'}
        //     type="button"
        //     isValid={!capture}
        //     variant="outline"
        //     className="px-4 py-2"
        //     onClick={handleBlockFace}
        //   />
        // ) : (
        //   <div className="" />
        // );
        return null;
      }

      case 3:
        return (
          <div className="flex items-center gap-3">
            <Button
              text="Reînregistrează"
              type="button"
              variant="outline"
              className="px-4 py-2"
              onClick={handleRecordAgain}
            />
            <Button
              text="Întrebarea următoare"
              type="button"
              variant="primary"
              className="px-4 py-2"
              onClick={handleNext}
              isSubmitting={isSubmitting ?? false}
            />
          </div>
        );

      default:
        return (
          <Button
            text="Trimite"
            type="button"
            variant="primary"
            icon={<IoVideocamOutline size={20} color="#fff" />}
            className="px-4 py-2"
            hasIcon
            onClick={handleShowRecordingScreen}
          />
        );
    }
  };
  return renderBottomNavigation();
};

export default React.memo(VideoBottomBar);
