import React from 'react';
import VideoPlayer from '../video-player';
import { VideoQuestionType } from '@/types';

interface IProps {
  questions: VideoQuestionType[];
  currentIndex: number;
}

const QuestionDisplay: React.FC<IProps> = ({ questions, currentIndex }) => (
  <VideoPlayer url={questions[currentIndex]?.question_video_url} />
);

export default React.memo(QuestionDisplay);
