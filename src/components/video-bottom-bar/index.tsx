import React from 'react';
import Button from '../button';
import { IoIosPlay } from 'react-icons/io';
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
  isDemo?: boolean;
}

const VideoBottomBar: React.FC<IProps> = ({
  handleNext,
  handleShowRecordingScreen,
  blockface,
  step,
  capture,
  handleBlockFace,
  handleRecordAgain,
  isDemo = false,
  isSubmitting,
}) => {
  const renderBottomNavigation = () => {
    switch (step) {
      case 1:
        return !isDemo ? (
          <Button
            text="Record"
            type="button"
            variant="primary"
            icon={<IoVideocamOutline size={20} color="#fff" />}
            className="px-4 py-2"
            hasIcon
            onClick={handleShowRecordingScreen}
          />
        ) : (
          <div className="flex items-center gap-4">
            <Button
              text="Start Poll"
              type="submit"
              variant="primary"
              icon={<IoIosPlay size={20} color="#fff" />}
              className="px-4 py-2"
              hasIcon
              onClick={handleNext}
            />
            <Button
              text="Demo"
              type="button"
              variant="outline"
              className="px-4 py-2"
              onClick={handleShowRecordingScreen}
            />
          </div>
        );

      case 2:
        return !capture ? (
          <Button
            text={blockface ? 'Block your face' : 'unblock your face'}
            type="button"
            isValid={!capture}
            variant="outline"
            className="px-4 py-2"
            onClick={handleBlockFace}
          />
        ) : (
          <div className="" />
        );

      case 3:
        return (
          <div className="flex items-center gap-3">
            <Button
              text="Record Again"
              type="button"
              variant="primary"
              icon={<IoVideocamOutline size={20} color="#fff" />}
              className="px-4 py-2"
              hasIcon
              onClick={handleRecordAgain}
            />
            <Button
              text="Next"
              type="button"
              variant="outline"
              className="px-4 py-2"
              onClick={handleNext}
              isSubmitting={isSubmitting ?? false}
            />
          </div>
        );

      default:
        return (
          <Button
            text="Record"
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
