export interface ScoreSubmission {
  fullName: string;
  preScore: number;
  postScore: number;
  improvement: number;
  qualityGrade: string;
  loginTime: string;
  logoutTime: string;
  timestamp?: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string; // The literal text or index of correct choice
}

export interface GameItem {
  id: string;
  term: string;
  definition: string;
  category: string;
  emoji: string;
}

export type ActiveTab = "pretest" | "content-tab1" | "content-tab2" | "posttest" | "game" | "progress";
