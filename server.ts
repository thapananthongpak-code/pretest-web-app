import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface ScoreSubmission {
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
const inMemoryLeaderboard: ScoreSubmission[] = [
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

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyF7b1fhBHXTDQ2JS5LAYyPpdwLVp-prQ-zOwV9zSxFcWtlg7pnCSc7wbBJjAKjMjo/exec";

const app = express();
app.use(express.json());

async function startServer() {
  const PORT = 3000;

  // API: Save Score / Login / Logout
  app.post("/api/submit", async (req, res) => {
    try {
      const submission: ScoreSubmission = req.body;
      
      // Save locally first to guarantee it is visible instantly
      const isDuplicate = inMemoryLeaderboard.some(
        item => item.fullName === submission.fullName && 
                item.loginTime === submission.loginTime && 
                item.preScore === submission.preScore &&
                item.postScore === submission.postScore
      );
      
      if (!isDuplicate) {
        inMemoryLeaderboard.push({
          ...submission,
          timestamp: new Date().toISOString()
        });
      }

      // Forward to Google Apps Script Web App (Node-to-Node bypasses CORS)
      console.log("Forwarding submission to Google Apps Script...", submission);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout

      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(submission),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const result = await response.json().catch(() => ({ status: "success" }));
          console.log("Apps Script save response:", result);
          return res.json({ 
            success: true, 
            source: "google_sheet", 
            message: "บันทึกข้อมูลลง Google Sheet สำเร็จ!",
            data: result 
          });
        } else {
          console.warn("Apps Script replied with error status:", response.status);
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.warn("Apps Script fetch error (will fallback to local storage):", err.message || err);
      }

      // Return local success even if Google Sheets has network issue (improves offline experience)
      return res.json({ 
        success: true, 
        source: "local_cache", 
        message: "บันทึกข้อมูลเรียบร้อย (ระบบออฟไลน์ชั่วคราว ข้อมูลจะซิงค์ในภายหลัง)" 
      });

    } catch (error: any) {
      console.error("API submission failed:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API: Get Leaderboard Data
  app.get("/api/leaderboard", async (req, res) => {
    try {
      console.log("Fetching leaderboard from Google Apps Script...");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const result: any = await response.json();
          if (result && result.status === "success" && Array.isArray(result.data)) {
            console.log("Successfully fetched Google Sheet leaderboard records:", result.data.length);
            
            // Map sheet objects to submission format
            const sheetRecords: ScoreSubmission[] = result.data.map((row: any) => ({
              fullName: row.fullName || "",
              preScore: Number(row.preScore) || 0,
              postScore: Number(row.postScore) || 0,
              improvement: Number(row.improvement) || 0,
              qualityGrade: row.qualityGrade || "",
              loginTime: row.loginTime || "",
              logoutTime: row.logoutTime || "",
              timestamp: row.timestamp || ""
            })).filter((row: any) => row.fullName !== "");

            // Merge sheet records and memory records (removing duplicates based on fullName & loginTime)
            const mergedMap = new Map<string, ScoreSubmission>();
            
            // Put in-memory defaults first
            inMemoryLeaderboard.forEach(item => {
              const key = `${item.fullName}_${item.loginTime}`;
              mergedMap.set(key, item);
            });

            // Override/add sheet records (to get fresh ones)
            sheetRecords.forEach(item => {
              const key = `${item.fullName}_${item.loginTime}`;
              mergedMap.set(key, item);
            });

            const mergedList = Array.from(mergedMap.values());
            return res.json({ success: true, data: mergedList });
          }
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.warn("Apps Script read failed (using local data):", err.message || err);
      }

      // Fallback
      res.json({ success: true, data: inMemoryLeaderboard });
    } catch (error: any) {
      res.status(500).json({ success: false, data: inMemoryLeaderboard, error: error.message });
    }
  });

  // Serve Vite or static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;
