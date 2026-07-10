import { Request, Response } from "express";
import { inMemoryLeaderboard, APPS_SCRIPT_URL, ScoreSubmission } from "./_shared.js";

export default async function handler(req: Request, res: Response) {
  // Enable CORS manually just in case
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

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
          return res.status(200).json({ success: true, data: mergedList });
        }
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn("Apps Script read failed (using local data):", err.message || err);
    }

    // Fallback
    res.status(200).json({ success: true, data: inMemoryLeaderboard });
  } catch (error: any) {
    console.error("API leaderboard fetch failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
