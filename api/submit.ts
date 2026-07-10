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

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const submission: ScoreSubmission = req.body;
    
    if (!submission || !submission.fullName) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

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
        return res.status(200).json({ 
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
    return res.status(200).json({ 
      success: true, 
      source: "local_cache", 
      message: "บันทึกข้อมูลเรียบร้อย (ระบบออฟไลน์ชั่วคราว ข้อมูลจะซิงค์ในภายหลัง)" 
    });

  } catch (error: any) {
    console.error("API submission failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
