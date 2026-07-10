/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import LoginScreen from "./components/LoginScreen";
import PreTest from "./components/PreTest";
import PostTest from "./components/PostTest";
import ContentTabs from "./components/ContentTabs";
import InteractiveGame from "./components/InteractiveGame";
import ProgressScreen from "./components/ProgressScreen";
import { ActiveTab } from "./types";

export default function App() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [preScore, setPreScore] = useState<number | null>(null);
  const [postScore, setPostScore] = useState<number | null>(null);
  const [loginTime, setLoginTime] = useState<string>("");
  const [logoutTime, setLogoutTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("pretest");

  // Format date helper
  const getThaiDateTime = () => {
    const d = new Date();
    // 2026 local time format
    return d.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleLogin = (name: string) => {
    setFullName(name);
    setLoginTime(getThaiDateTime());
    setPreScore(null);
    setPostScore(null);
    setActiveTab("pretest");
  };

  const handleLogout = () => {
    import("sweetalert2").then((Swal) => {
      Swal.default.fire({
        title: "ยืนยันการออกจากระบบ?",
        text: "คุณต้องการออกจากบทเรียนวิชานี้และกลับไปยังหน้าจอแรกใช่ไหม?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ออกจากระบบ",
        cancelButtonText: "เรียนต่อ",
        confirmButtonColor: "#e11d48",
        cancelButtonColor: "#4f46e5",
        customClass: {
          popup: 'rounded-2xl font-sans'
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          const lOutTime = getThaiDateTime();
          setLogoutTime(lOutTime);

          // Optional: we can do a background call to submit logout time before clear,
          // but usually keeping the states clear is best for next user login.
          setFullName(null);
          setPreScore(null);
          setPostScore(null);
          setLoginTime("");
          setLogoutTime("");
          setActiveTab("pretest");

          Swal.default.fire({
            title: "ออกจากระบบสำเร็จ",
            text: "ขอบคุณที่เข้ามาเรียนรู้ร่วมกันนะครับ ขอให้โชคดี! 🤖🍀",
            icon: "success",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#4f46e5",
            customClass: {
              popup: 'rounded-2xl font-sans'
            }
          });
        }
      });
    });
  };

  const handlePreTestComplete = (score: number) => {
    setPreScore(score);
    // Automatically transition to the first content tab upon pre-test completion
    setActiveTab("content-tab1");
  };

  const handlePostTestComplete = (score: number) => {
    setPostScore(score);
    setLogoutTime(getThaiDateTime());
    // Move directly to progress dashboard to review development progress and sync to sheet
    setActiveTab("progress");
  };

  return (
    <div className="min-h-screen bg-[#e0f2fe] relative overflow-x-hidden flex flex-col justify-between font-sans select-none">
      
      {/* Animated Clouds & Soft Blur Background Shape Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-48 h-20 bg-white/60 blur-3xl rounded-full"></div>
        <div className="absolute top-40 right-20 w-64 h-24 bg-white/40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-32 bg-white/50 blur-3xl rounded-full"></div>

        <div className="absolute top-[8%] left-[-150px] text-7xl opacity-25 select-none animate-cloud-slow">☁️</div>
        <div className="absolute top-[25%] left-[-200px] text-8xl opacity-20 select-none animate-cloud-medium">☁️</div>
        <div className="absolute top-[60%] left-[-100px] text-6xl opacity-30 select-none animate-cloud-fast">☁️</div>
        <div className="absolute top-[45%] left-[-250px] text-9xl opacity-15 select-none animate-cloud-slow">☁️</div>
        <div className="absolute bottom-[10%] left-[-120px] text-7xl opacity-20 select-none animate-cloud-medium">☁️</div>
      </div>

      {/* Main Orchestration Body */}
      <div className="relative z-10 flex-1 flex flex-col">
        {fullName === null ? (
          /* Login Screen Container */
          <div className="flex-1 flex items-center justify-center py-10">
            <LoginScreen onLogin={handleLogin} />
          </div>
        ) : (
          /* Logged In Classroom Container */
          <div className="flex-1 flex flex-col md:flex-row items-stretch">
            
            {/* Sidenav display on the left */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              preTestCompleted={preScore !== null}
              fullName={fullName}
              onLogout={handleLogout}
            />

            {/* Central Learning Space */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto max-w-full">
              {activeTab === "pretest" && (
                <PreTest onComplete={handlePreTestComplete} />
              )}

              {(activeTab === "content-tab1" || activeTab === "content-tab2") && (
                <ContentTabs
                  currentTab={activeTab}
                  onTabChange={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === "game" && (
                <InteractiveGame />
              )}

              {activeTab === "posttest" && (
                <PostTest onComplete={handlePostTestComplete} />
              )}

              {activeTab === "progress" && (
                <ProgressScreen
                  fullName={fullName}
                  preScore={preScore ?? 0}
                  postScore={postScore}
                  loginTime={loginTime}
                  logoutTime={logoutTime || getThaiDateTime()}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer across all layouts */}
      <footer className="relative z-20 py-4 bg-white/20 backdrop-blur-xs border-t border-white/25 text-center text-[11px] text-slate-500 font-bold tracking-wide">
        © 2026 Copyright | พัฒนาโดย Thapanan Thongpak
      </footer>

    </div>
  );
}
