import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Trophy, ArrowUpRight, TrendingUp, Calendar, Clock, Award } from "lucide-react";
import { ScoreSubmission } from "../types";

interface ProgressScreenProps {
  fullName: string;
  preScore: number;
  postScore: number | null;
  loginTime: string;
  logoutTime: string;
}

export default function ProgressScreen({
  fullName,
  preScore,
  postScore,
  loginTime,
  logoutTime
}: ProgressScreenProps) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDataSent, setIsDataSent] = useState(false);
  const [saveSource, setSaveSource] = useState<"google_sheet" | "local_cache" | null>(null);

  const finalPostScore = postScore !== null ? postScore : 0;
  const improvement = finalPostScore - preScore;

  // Calculate quality grade
  const getQualityGrade = (score: number) => {
    if (score >= 9) return "ยอดเยี่ยม (Excellent) 🥇";
    if (score >= 7) return "ดีมาก (Very Good) 🥈";
    if (score >= 5) return "ผ่านเกณฑ์ (Fair) 🥉";
    return "ควรปรับปรุง (Needs Improvement) ✏️";
  };

  const qualityGrade = getQualityGrade(finalPostScore);

  const getQualityEmoji = (score: number) => {
    if (score >= 9) return "🏆";
    if (score >= 7) return "⭐";
    if (score >= 5) return "👍";
    return "📖";
  };

  // Auto trigger save when component mounts
  useEffect(() => {
    if (postScore === null || isDataSent) return;

    const saveData = async () => {
      setSaveStatus("saving");
      try {
        const payload: ScoreSubmission = {
          fullName,
          preScore,
          postScore: finalPostScore,
          improvement,
          qualityGrade,
          loginTime,
          logoutTime
        };

        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success) {
            setSaveStatus("success");
            setSaveSource(json.source || "google_sheet");
            setIsDataSent(true);
          } else {
            setSaveStatus("error");
            setErrorMessage(json.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
          }
        } else {
          setSaveStatus("error");
          setErrorMessage(`เซิร์ฟเวอร์ตอบสนองผิดพลาด: ${response.status}`);
        }
      } catch (err: any) {
        setSaveStatus("error");
        setErrorMessage(err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      }
    };

    saveData();
  }, [postScore, fullName, preScore, finalPostScore, improvement, qualityGrade, loginTime, logoutTime, isDataSent]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 relative z-10 space-y-6">
      
      {/* 2.5 Header */}
      <div className="text-center mb-6">
        <span className="px-3.5 py-1.5 bg-blue-100 text-blue-900 text-xs font-black rounded-full uppercase tracking-wider shadow-xs">
          📊 รายงานความก้าวหน้า
        </span>
        <h2 className="text-2xl font-black text-blue-900 mt-2 leading-tight">
          ผลลัพธ์คะแนนและการพัฒนา
        </h2>
        <p className="text-sm text-blue-700/60 font-semibold mt-1">
          เปรียบเทียบคะแนนก่อนเรียนและหลังเรียนเพื่อแสดงทักษะความงอกงามของปัญญา
        </p>
      </div>

      {/* Cloud Sync Status bar */}
      <div className="w-full">
        {saveStatus === "saving" && (
          <div className="flex items-center gap-3 p-4 bg-blue-100/60 border border-blue-200/40 text-blue-900 rounded-[24px] animate-pulse">
            <RefreshCw size={18} className="animate-spin text-blue-600 shrink-0" />
            <div className="text-xs">
              <p className="font-black">กำลังซิงก์ข้อมูลไปที่ Google Sheet...</p>
              <p className="text-blue-700 font-bold">กรุณารอสักครู่ ห้ามปิดหน้าต่างเบราว์เซอร์</p>
            </div>
          </div>
        )}

        {saveStatus === "success" && (
          <div className="flex items-center gap-3 p-4 bg-emerald-100/60 border border-emerald-200/40 text-emerald-900 rounded-[24px]">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0 animate-bounce" />
            <div className="text-xs">
              <p className="font-black">
                {saveSource === "google_sheet" 
                  ? "ซิงก์ข้อมูลกับ Apps Script & บันทึกคลาวด์สำเร็จ! ☁️" 
                  : "บันทึกผลการเรียนลงเครื่องสำเร็จ! (แคชโลคอลสำเร็จ)"}
              </p>
              <p className="text-emerald-700 font-bold">ข้อมูลของนาย/นางสาว {fullName} ได้ส่งไปยังสถิติตารางหลักเรียนแล้ว</p>
            </div>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="flex items-center gap-3 p-4 bg-rose-100/60 border border-rose-200/40 text-rose-900 rounded-[24px]">
            <AlertCircle size={20} className="text-rose-600 shrink-0" />
            <div className="text-xs">
              <p className="font-black">ไม่สามารถอัปโหลดข้อมูลไปยังชีตหลักได้ (เครือข่ายมีปัญญา)</p>
              <p className="text-rose-600 font-bold">{errorMessage} (แต่ข้อมูลระบบคะแนนในหน้านี้ยังครบถ้วน)</p>
            </div>
          </div>
        )}
      </div>

      {/* Core Score Comparison Card */}
      <div 
        className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-6 md:p-8 border border-white shadow-2xl relative overflow-hidden group"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
          
          {/* Pre Test score block */}
          <div className="p-5 rounded-[24px] bg-white/60 border border-blue-100/30 flex flex-col items-center justify-center space-y-1 shadow-sm">
            <span className="text-xs font-bold text-blue-900/50 uppercase tracking-wider">คะแนนสอบก่อนเรียน</span>
            <div className="text-4xl font-mono font-black text-blue-900/40 py-1">
              {preScore} <span className="text-sm font-bold text-blue-900/30">/ 10</span>
            </div>
            <span className="text-[11px] text-blue-900/40 font-semibold">วัดก่อนรับความรู้</span>
          </div>

          {/* Development / Improvement block */}
          <div className="p-5 rounded-[24px] bg-blue-100/50 border border-blue-200/40 flex flex-col items-center justify-center space-y-1 shadow-sm relative">
            <div className="absolute -top-3 px-3 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full">
              อัตราพัฒนาการ
            </div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">คะแนนความงอกงาม</span>
            <div className="text-5xl font-mono font-black text-blue-700 py-1 flex items-center gap-1">
              {improvement >= 0 ? `+${improvement}` : improvement}
              <ArrowUpRight size={24} className="text-blue-500 animate-pulse shrink-0" />
            </div>
            <span className="text-[11px] text-blue-700 font-black flex items-center gap-1">
              <TrendingUp size={12} />
              เพิ่มขึ้น {Math.max(0, improvement * 10)}%
            </span>
          </div>

          {/* Post Test score block */}
          {postScore !== null ? (
            <div className="p-5 rounded-[24px] bg-rose-100/50 border border-rose-200/40 flex flex-col items-center justify-center space-y-1 shadow-sm">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">คะแนนสอบหลังเรียน</span>
              <div className="text-4xl font-mono font-black text-rose-600 py-1">
                {postScore} <span className="text-sm font-bold text-rose-400">/ 10</span>
              </div>
              <span className="text-[11px] text-rose-600/70 font-semibold">วัดหลังจบบทเรียน</span>
            </div>
          ) : (
            <div className="p-5 rounded-[24px] bg-slate-100/40 border border-dashed border-slate-300 flex flex-col items-center justify-center space-y-1">
              <span className="text-xs font-bold text-slate-400">คะแนนสอบหลังเรียน</span>
              <p className="text-xs text-slate-500 font-bold py-2">⚠️ ยังไม่ได้สอบหลังเรียน</p>
              <span className="text-[10px] text-slate-400 font-medium">โปรดทำแบบทดสอบ</span>
            </div>
          )}

        </div>

        {/* Visual Progress Bar Chart */}
        <div className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-blue-900/60">
              <span>เปรียบเทียบสัดส่วน: คะแนนก่อนเรียน</span>
              <span className="font-mono">{preScore * 10}%</span>
            </div>
            <div className="w-full h-4 bg-white/40 rounded-full overflow-hidden border border-blue-100/40">
              <div 
                className="h-full bg-gradient-to-r from-blue-400/60 to-blue-500/60 rounded-full transition-all duration-1000"
                style={{ width: `${preScore * 10}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-blue-900/60">
              <span>เปรียบเทียบสัดส่วน: คะแนนหลังเรียน</span>
              <span className="font-mono text-rose-600">{finalPostScore * 10}%</span>
            </div>
            <div className="w-full h-4 bg-white/40 rounded-full overflow-hidden border border-blue-100/40">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-1000"
                style={{ width: `${finalPostScore * 10}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Quality Level Report Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Certificate style card */}
        <div 
          className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-6 border border-white text-center flex flex-col justify-between items-center group shadow-2xl"
        >
          <div className="text-4xl mb-2">{getQualityEmoji(finalPostScore)}</div>
          <h4 className="text-sm font-bold text-blue-900/40 uppercase tracking-widest leading-none">ระดับคุณภาพการเรียนรู้</h4>
          <h3 className="text-xl font-black text-blue-900 mt-2 leading-none">
            {qualityGrade}
          </h3>

          <p className="text-xs text-blue-900/70 font-semibold leading-relaxed mt-4 max-w-xs">
            {finalPostScore >= 9 && "ยอดเยี่ยมที่สุด! คุณมีความเข้าใจในโครงสร้างและขั้นตอนกระบวนการของปัญญาประดิษฐ์ (ML) สมบูรณ์แบบ พร้อมก้าวเข้าสู่การประยุกต์ใช้งานในสายอาชีพ"}
            {finalPostScore >= 7 && finalPostScore < 9 && "ดีมาก! คุณมีความเข้าใจเกณฑ์หลักขั้นตอนทั้ง 5 ของระบบคอมพิวเตอร์อย่างลึกซึ้ง สามารถแชร์ความรู้ให้เพื่อนๆ ได้สบาย"}
            {finalPostScore >= 5 && finalPostScore < 7 && "ผ่านเกณฑ์มาตรฐาน! คุณเข้าใจรากฐานการป้อนและวิเคราะห์ข้อมูลเบื้องต้นอย่างมั่นคง สามารถพัฒนาต่อยอดทบทวนความรู้ได้"}
            {finalPostScore < 5 && "คุณผ่านการเก็บข้อมูลปูพื้นฐานเรียบร้อย ลองทบทวนอ่านบทเรียนในแท็บสาระความรู้ใหม่อีกรอบเพื่อความฟิตเพิ่มขึ้นนะครับ!"}
          </p>

          <div className="mt-5 w-full pt-3 border-t border-blue-100/30">
            <span className="text-[10px] text-blue-900/40 font-bold block uppercase">
              วิชา เปิดโลกเทคโนโลยีปัญญาประดิษฐ์ | ปวช.1
            </span>
          </div>
        </div>

        {/* Time statistics block */}
        <div 
          className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-6 border border-white flex flex-col justify-between group shadow-2xl"
        >
          <div>
            <h4 className="text-sm font-black text-blue-900 flex items-center gap-2 mb-4 pb-2 border-b border-blue-100/30">
              <Clock size={16} className="text-blue-600" />
              <span>ประวัติล็อกเวลาเข้า-ออกเรียน</span>
            </h4>

            <div className="space-y-3.5">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-xl bg-blue-100/50 text-blue-700 flex items-center justify-center">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-[10px] text-blue-900/40 font-bold leading-none">เวลา Login เข้าระบบ</p>
                  <p className="text-xs text-blue-900 font-extrabold mt-1">{loginTime}</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-xl bg-rose-100/50 text-rose-700 flex items-center justify-center">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-[10px] text-blue-900/40 font-bold leading-none">เวลา Logout / บันทึกผลลัพธ์</p>
                  <p className="text-xs text-blue-900 font-extrabold mt-1">{logoutTime}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2 mt-4">
            <Award size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
              สถิติเวลานี้จะถูกนำไปใช้วิเคราะห์วินัยและความตั้งใจเรียนในระบบฐานข้อมูล Google Sheet เพื่อเก็บคะแนนปลายปีอย่างต่อเนื่อง
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
