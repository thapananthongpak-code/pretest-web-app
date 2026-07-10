import { useState, useEffect, FormEvent } from "react";
import { Search, Trophy, BookOpen, GraduationCap, ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import { ScoreSubmission } from "../types";

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [fullName, setFullName] = useState("");
  const [leaderboard, setLeaderboard] = useState<ScoreSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch leaderboard data
  const fetchLeaderboard = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Sort by postScore descending, then by preScore descending, then by name
          const sorted = json.data.sort((a: ScoreSubmission, b: ScoreSubmission) => {
            if (b.postScore !== a.postScore) {
              return b.postScore - a.postScore;
            }
            if (b.improvement !== a.improvement) {
              return b.improvement - a.improvement;
            }
            return a.fullName.localeCompare(b.fullName, "th");
          });
          setLeaderboard(sorted);
        }
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          title: "กรุณากรอกชื่อ-นามสกุล",
          text: "ใส่ชื่อและนามสกุลของคุณก่อนเข้าสู่บทเรียนด้วยนะครับ 🤖",
          icon: "warning",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#4f46e5",
          customClass: {
            popup: 'rounded-2xl font-sans'
          }
        });
      });
      return;
    }
    onLogin(fullName.trim());
  };

  // Filter leaderboard based on query
  const filteredLeaderboard = leaderboard.filter((item) =>
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 relative z-10 flex flex-col items-center">
      
      {/* 1.1 Header Top Section */}
      <div className="text-center mb-8 max-w-2xl">
        <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-black tracking-wider rounded-full shadow-sm uppercase mb-3 inline-block animate-pulse">
          🎯 บทเรียนออนไลน์แบบโต้ตอบ
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 leading-tight tracking-tight mt-1">
          เปิดโลกเทคโนโลยีปัญญาประดิษฐ์
        </h1>
        <p className="text-lg md:text-xl font-bold text-blue-800 mt-2 bg-white/60 border border-white backdrop-blur-md py-1.5 px-5 rounded-2xl inline-block shadow-xs">
          เรื่อง: ขั้นตอนวิธีการเรียนรู้ของเครื่อง (Machine Learning)
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-blue-900/60 font-bold">
          <GraduationCap size={18} className="text-blue-700" />
          <span>ระดับชั้น ปวช.1 (วิชาเปิดโลกเทคโนโลยีปัญญาประดิษฐ์)</span>
        </div>
      </div>

      {/* Main Container: Split Form and Illustration or side by side */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-stretch">
        
        {/* Left column: Login card (5 cols) */}
        <div className="md:col-span-5 flex flex-col">
          <div 
            className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-6 border border-white shadow-2xl flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-3xl transition-all duration-300"
          >
            {/* White sweep light pass effect container */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float">
                  <Sparkles size={22} className="animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-blue-900 leading-none">เข้าเรียนออนไลน์</h3>
                  <p className="text-xs text-blue-700/70 mt-1 font-bold">กรอกชื่อเพื่อบันทึกข้อมูลคะแนน</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">
                    ชื่อ - นามสกุล ผู้เรียน <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-name"
                    type="text"
                    placeholder="เช่น นายธพนันท์ ทองภักดิ์"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/80 border border-blue-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 font-bold placeholder-blue-300 transition"
                  />
                </div>

                <button
                  id="btn-login-submit"
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg hover:shadow-blue-300/40 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                >
                  <span>เริ่มบทเรียนโต้ตอบ</span>
                  <ChevronRight size={18} />
                </button>
              </form>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-200/30 relative z-10">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  🦖
                </div>
                <div className="text-xs">
                  <p className="font-bold text-blue-950">ระบบคลาวด์อัจฉริยะ</p>
                  <p className="text-blue-700/60 font-semibold">เชื่อมต่อตรงกับ Apps Script และ Google Sheets</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Intro and Instructions (7 cols) */}
        <div className="md:col-span-7 flex flex-col">
          <div 
            className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-8 border border-white shadow-2xl flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3.5 py-1 bg-blue-100 text-blue-700 text-xs font-black rounded-full">
                  🤖 แนะนำบทเรียน
                </div>
              </div>
              <h2 className="text-xl font-black text-blue-900 mb-3 leading-snug">
                บทเรียนเรื่อง: ขั้นตอนการทำงานของการเรียนรู้ของเครื่อง
              </h2>
              <p className="text-sm text-blue-800/80 font-medium leading-relaxed mb-6">
                ยินดีต้อนรับผู้เรียนระดับชั้น <strong className="text-blue-900">ปวช. 1</strong> เข้าสู่บทเรียนปัญญาประดิษฐ์เสมือนจริง 
                เราจะมาเรียนรู้กระบวนการสอนคอมพิวเตอร์ให้คิด วิเคราะห์ และแยกแยะข้อมูลด้วย Machine Learning 
                ผ่านระบบเรียนโต้ตอบที่มีการทดสอบระดับก่อน-หลังเรียน เนื้อหาอินเตอร์แอคทีฟ และมินิเกมจับคู่ฝึกทักษะ!
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-xl bg-amber-100 text-amber-950 flex items-center justify-center text-xs font-black shrink-0">1</span>
                  <p className="text-xs text-blue-900/80 font-semibold">
                    <strong className="text-blue-950">ทำแบบทดสอบก่อนเรียน (10 ข้อ):</strong> มีตัวจับเวลาข้อละ 20 วินาที เพื่อเช็กความเข้าใจเบื้องต้น
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-xl bg-indigo-100 text-indigo-950 flex items-center justify-center text-xs font-black shrink-0">2</span>
                  <p className="text-xs text-blue-900/80 font-semibold">
                    <strong className="text-blue-950">เข้าศึกษากลุ่มสาระการเรียนรู้:</strong> ศึกษาเนื้อหาที่มีทั้งไอคอนประกอบและวิดีโอจาก YouTube เรื่อง Teachable Machine
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-center text-xs font-black shrink-0">3</span>
                  <p className="text-xs text-blue-900/80 font-semibold">
                    <strong className="text-blue-950">เล่นเกมจับคู่แสนสนุก:</strong> ประลองความจำทักษะขั้นตอนทำงานของระบบ Machine Learning
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-xl bg-rose-100 text-rose-950 flex items-center justify-center text-xs font-black shrink-0">4</span>
                  <p className="text-xs text-blue-900/80 font-semibold">
                    <strong className="text-blue-950">สอบหลังเรียนและรับเกียรติบัตร:</strong> วัดพัฒนาการเปรียบเทียบความก้าวหน้า พร้อมส่งข้อมูลขึ้นคลาวด์ชีตอัตโนมัติ!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100/60 rounded-2xl flex items-center gap-3">
              <span className="text-2xl animate-bounce">💡</span>
              <p className="text-xs text-blue-900 font-bold leading-snug">
                เมื่อทำแบบทดสอบหลังเรียนสำเร็จ ผลคะแนนความก้าวหน้าจะไปแสดงบนตารางผู้เข้าเรียนทันที!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 2.5 Bottom Section: Leaderboard (ตารางสถิติลำดับคะแนนสูงสุด) */}
      <div className="w-full mt-10">
        <div 
          className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-6 md:p-8 border border-white shadow-2xl relative overflow-hidden group"
        >
          {/* Shine Sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-blue-100/30 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float">
                <Trophy size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-blue-900 flex items-center gap-1.5 leading-tight">
                  ทำเนียบคะแนนสูงสุด (Leaderboard)
                </h2>
                <p className="text-xs text-blue-700/70 font-semibold mt-1">แสดงรายชื่อเรียงตามคะแนนสอบหลังเรียนสูงสุด</p>
              </div>
            </div>

            {/* Refresh & Search block */}
            <div className="flex items-center gap-3">
              <button
                id="btn-refresh-leaderboard"
                onClick={() => fetchLeaderboard(true)}
                disabled={refreshing}
                title="รีเฟรชข้อมูล"
                className="p-3 bg-white/80 hover:bg-white border border-blue-100 text-blue-900 rounded-2xl transition flex items-center justify-center hover:scale-105 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              </button>

              <div className="relative max-w-xs w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-400">
                  <Search size={16} />
                </span>
                <input
                  id="input-search-leaderboard"
                  type="text"
                  placeholder="พิมพ์ค้นหารายชื่อ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-blue-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 font-bold placeholder-blue-300 text-sm transition outline-none shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 relative z-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-blue-700 font-bold">กำลังโหลดอันดับผู้เรียน...</p>
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <div className="text-center py-12 bg-white/20 rounded-2xl border border-dashed border-blue-200 relative z-10">
              <span className="text-3xl">🔍</span>
              <p className="text-sm font-bold text-blue-900/60 mt-2">ไม่พบรายชื่อผู้เรียนที่ค้นหา</p>
              <p className="text-xs text-blue-700/50 font-medium mt-1">ลองพิมพ์ค้นหาด้วยคีย์เวิร์ดอื่น</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-blue-100/30 bg-white/40 relative z-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50/50 text-blue-900/70 text-xs font-black uppercase border-b border-blue-100/30">
                    <th className="py-3 px-4 text-center w-16">อันดับ</th>
                    <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                    <th className="py-3 px-4 text-center">ก่อนเรียน</th>
                    <th className="py-3 px-4 text-center">หลังเรียน</th>
                    <th className="py-3 px-4 text-center">พัฒนาการ</th>
                    <th className="py-3 px-4 text-center">ระดับคุณภาพ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50/40 text-sm font-bold text-blue-900/90">
                  {filteredLeaderboard.map((item, index) => {
                    let rankBadge = "";
                    let rankStyle = "bg-slate-100 text-slate-600";
                    if (index === 0) {
                      rankBadge = "🥇";
                      rankStyle = "bg-amber-100 text-amber-700 ring-2 ring-amber-300 scale-105";
                    } else if (index === 1) {
                      rankBadge = "🥈";
                      rankStyle = "bg-slate-200 text-slate-800 scale-102";
                    } else if (index === 2) {
                      rankBadge = "🥉";
                      rankStyle = "bg-amber-50 text-amber-800";
                    }

                    // Progress indicators
                    const devSign = item.improvement > 0 ? `+${item.improvement}` : `${item.improvement}`;
                    const devStyle = item.improvement > 0 ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-50";

                    // Quality badges
                    let qualityBadgeColor = "bg-slate-100 text-slate-600";
                    if (item.qualityGrade.includes("ยอดเยี่ยม") || item.qualityGrade.includes("Excellent")) {
                      qualityBadgeColor = "bg-emerald-100 text-emerald-800 border border-emerald-200";
                    } else if (item.qualityGrade.includes("ดีมาก") || item.qualityGrade.includes("Very Good")) {
                      qualityBadgeColor = "bg-sky-100 text-sky-800 border border-sky-200";
                    } else if (item.qualityGrade.includes("ดี") || item.qualityGrade.includes("Good")) {
                      qualityBadgeColor = "bg-blue-100 text-blue-800 border border-blue-200";
                    } else if (item.qualityGrade.includes("ผ่าน") || item.qualityGrade.includes("Fair")) {
                      qualityBadgeColor = "bg-amber-100 text-amber-800 border border-amber-200";
                    }

                    return (
                      <tr 
                        key={index}
                        className="hover:bg-white/70 transition-colors duration-250 group"
                      >
                        <td className="py-3 px-4 text-center">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black mx-auto text-xs ${rankStyle}`}>
                            {rankBadge ? rankBadge : index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-800 group-hover:text-indigo-600 transition">
                              {item.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-500">
                          {item.preScore} /10
                        </td>
                        <td className="py-3 px-4 text-center text-indigo-600 font-mono text-base font-extrabold">
                          {item.postScore} /10
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-extrabold ${devStyle}`}>
                            {devSign}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold leading-none inline-block ${qualityBadgeColor}`}>
                            {item.qualityGrade.split(" (")[0]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
