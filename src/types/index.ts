export interface VideoQuestionType {
  id: number;
  question_video_url: string;
  poll_id: number;
  prompt: string;
}

export interface IntroDataType {
  id: string;
  created_at: string;
  title: string;
  demo_video: string;
}
