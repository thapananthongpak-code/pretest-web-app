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

// Memory database for immediate updates and fallback
export const inMemoryLeaderboard: ScoreSubmission[] = [
  {
    fullName: "ณัฐพงษ์ เรียนรู้ไว",
    preScore: 4,
    postScore: 10,
    improvement: 6,
    qualityGrade: "ยอดเยี่ยม (Excellent)",
    loginTime: "10/07/2026 08:30:00",
    logoutTime: "10/07/2026 08:55:00",
    timestamp: "2026-07-10T08:55:00.000Z"
  },
  {
    fullName: "วิภาดา ใจเพียร",
    preScore: 5,
    postScore: 9,
    improvement: 4,
    qualityGrade: "ดีมาก (Very Good)",
    loginTime: "10/07/2026 08:45:00",
    logoutTime: "10/07/2026 09:01:00",
    timestamp: "2026-07-10T09:01:00.000Z"
  },
  {
    fullName: "อภิสิทธิ์ ปัญญาประดิษฐ์",
    preScore: 3,
    postScore: 8,
    improvement: 5,
    qualityGrade: "ดีมาก (Very Good)",
    loginTime: "10/07/2026 08:15:00",
    logoutTime: "10/07/2026 08:42:00",
    timestamp: "2026-07-10T08:42:00.000Z"
  },
  {
    fullName: "พิชชาภา คล่องแคล่ว",
    preScore: 2,
    postScore: 7,
    improvement: 5,
    qualityGrade: "ดี (Good)",
    loginTime: "10/07/2026 08:20:00",
    logoutTime: "10/07/2026 08:38:00",
    timestamp: "2026-07-10T08:38:00.000Z"
  },
  {
    fullName: "กฤษณะ ตั้งใจเรียน",
    preScore: 4,
    postScore: 6,
    improvement: 2,
    qualityGrade: "ผ่านเกณฑ์ (Fair)",
    loginTime: "10/07/2026 08:00:00",
    logoutTime: "10/07/2026 08:25:00",
    timestamp: "2026-07-10T08:25:00.000Z"
  }
];

export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyF7b1fhBHXTDQ2JS5LAYyPpdwLVp-prQ-zOwV9zSxFcWtlg7pnCSc7wbBJjAKjMjo/exec";
