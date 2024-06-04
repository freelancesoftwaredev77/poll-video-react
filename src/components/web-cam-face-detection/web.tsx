import MobileDetect from 'mobile-detect';
import React from 'react';
import WebcamDemoForIosDevices from './indexv2';
import WebcamDemo from '.';

interface IProps {
  blockFace: boolean;
  capturing: boolean;
  setCapturing: React.Dispatch<React.SetStateAction<boolean>>;
  isFinishedRecording: boolean;
  setIsFinishedRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordedChunks: React.Dispatch<React.SetStateAction<never[]>>;
  recordedChunks: never[];
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const CompatibleWebcam = (props: IProps) => {
  const md = new MobileDetect(window.navigator.userAgent);

  const isChromeOnIphone =
    md.mobile() === 'iPhone' &&
    md.phone() === 'iPhone' &&
    md.userAgent() === 'Chrome';

  if (isChromeOnIphone) {
    return <WebcamDemoForIosDevices {...props} />;
  }
  return <WebcamDemo {...props} />;
};

export default CompatibleWebcam;
