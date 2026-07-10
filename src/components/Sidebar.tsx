import { BookOpen, FileQuestion, Gamepad2, LineChart, LogOut, Menu, X, Award, CheckCircle2 } from "lucide-react";
import { ActiveTab } from "../types";
import { useState } from "react";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  preTestCompleted: boolean;
  fullName: string;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  preTestCompleted,
  fullName,
  onLogout
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: "pretest" as ActiveTab,
      label: "แบบทดสอบก่อนเรียน",
      icon: FileQuestion,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      borderColor: "border-amber-300",
      description: "วัดระดับความรู้เบื้องต้น 10 ข้อ",
      locked: false // Pre-test is always unlocked
    },
    {
      id: "content-tab1" as ActiveTab,
      label: "ขั้นตอนการทำงานของ ML",
      icon: BookOpen,
      color: "bg-sky-500",
      textColor: "text-sky-700",
      borderColor: "border-sky-300",
      description: "กระบวนการสอนปัญญาประดิษฐ์",
      locked: !preTestCompleted
    },
    {
      id: "content-tab2" as ActiveTab,
      label: "การทดลอง Teachable Machine",
      icon: BookOpen,
      color: "bg-indigo-500",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-300",
      description: "ตัวอย่างและวิดีโอสอนสอนเครื่อง",
      locked: !preTestCompleted
    },
    {
      id: "game" as ActiveTab,
      label: "เกมจับคู่ท้าประลอง",
      icon: Gamepad2,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-300",
      description: "เกมจับคู่ความหมายขั้นตอน ML",
      locked: !preTestCompleted
    },
    {
      id: "posttest" as ActiveTab,
      label: "แบบทดสอบหลังเรียน",
      icon: Award,
      color: "bg-rose-500",
      textColor: "text-rose-700",
      borderColor: "border-rose-300",
      description: "วัดพัฒนาการความรู้ 10 ข้อ",
      locked: !preTestCompleted
    },
    {
      id: "progress" as ActiveTab,
      label: "ตรวจสอบคะแนนและการพัฒนา",
      icon: LineChart,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      borderColor: "border-purple-300",
      description: "กราฟและรายงานความก้าวหน้า",
      locked: !preTestCompleted
    }
  ];

  const handleTabClick = (tabId: ActiveTab, locked: boolean) => {
    if (locked) {
      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          title: "บทเรียนถูกล็อกอยู่!",
          text: "กรุณาทำ 'แบบทดสอบก่อนเรียน' ให้เสร็จสิ้นก่อนเพื่อปลดล็อกบทเรียนและกิจกรรมอื่นๆ",
          icon: "warning",
          confirmButtonText: "รับทราบ",
          confirmButtonColor: "#f59e0b",
          customClass: {
            popup: 'rounded-2xl font-sans'
          }
        });
      });
      return;
    }
    setActiveTab(tabId);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-6 text-slate-800">
      <div>
        {/* Course / Lesson Header in Bento Grid style */}
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3 animate-float">
            <span className="text-3xl">🤖</span>
          </div>
          <h2 className="font-bold text-blue-900 leading-tight">บทเรียนออนไลน์</h2>
          <p className="text-xs text-blue-700 opacity-70">AI Technology Level 1</p>
        </div>

        {/* User Info Card in Bento style */}
        <div className="mb-6 px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-blue-500 border border-white flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            {fullName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] text-blue-600 uppercase tracking-widest font-black leading-none">Student</p>
            <p className="text-sm font-bold text-blue-900 truncate mt-1">{fullName}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <p className="text-[10px] font-black text-blue-800/60 uppercase tracking-widest px-2 mb-3">
          เมนูการเรียนรู้
        </p>
        <div className="space-y-3">
          {menuItems.map((item) => {
            const isSelected = activeTab === item.id;
            const isLocked = item.locked;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleTabClick(item.id, isLocked)}
                className={`w-full flex items-start gap-3 p-3.5 text-left transition-all duration-300 ${
                  isLocked 
                    ? "opacity-50 cursor-not-allowed bg-slate-100/40 border border-slate-200/30" 
                    : isSelected
                      ? "bg-blue-500 text-white shadow-lg border border-blue-400/30 scale-102 hover:scale-[1.04]"
                      : "bg-white/60 shadow-sm border border-white text-blue-900 font-medium hover:scale-105 transition-all"
                }`}
                style={{ borderRadius: "18px" }}
              >
                <div className={`p-2 rounded-xl text-white shrink-0 ${isLocked ? "bg-slate-400" : isSelected ? "bg-white/20" : item.color}`}>
                  <item.icon size={16} />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-bold ${isLocked ? "text-slate-400" : isSelected ? "text-white" : "text-blue-900"}`}>
                      {item.label}
                    </span>
                    {!isLocked && item.id === "pretest" && preTestCompleted && (
                      <CheckCircle2 size={14} className={`${isSelected ? "text-white" : "text-emerald-500"} shrink-0`} />
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold block truncate mt-0.5 ${isSelected ? "text-blue-100" : "text-blue-700/60"}`}>
                    {isLocked ? "🔒 ล็อกอยู่ - ต้องทำแบบทดสอบก่อนเรียน" : item.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout & Copyright Section */}
      <div className="mt-8 pt-4 border-t border-blue-200/30 space-y-4">
        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-100 text-rose-600 font-bold border border-rose-200 hover:bg-rose-200/80 transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer"
          style={{ borderRadius: "16px" }}
        >
          <LogOut size={16} />
          <span>ออกจากระบบ</span>
        </button>

        <div className="text-center">
          <p className="text-[10px] text-blue-900/60 font-bold tracking-wide">
            © 2026 Copyright
          </p>
          <p className="text-[10px] text-blue-900/50 font-medium mt-0.5">
            พัฒนาโดย Thapanan Thongpak
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Nav bar */}
      <div className="md:hidden w-full flex items-center justify-between p-4 bg-white/40 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500 text-white rounded-xl">
            <BookOpen size={16} />
          </div>
          <div>
            <h1 className="text-xs font-black text-blue-900 leading-tight">ปัญญาประดิษฐ์ ปวช.1</h1>
            <p className="text-[10px] text-blue-700 font-bold">ขั้นตอนวิธีการเรียนรู้ของเครื่อง</p>
          </div>
        </div>
        <button
          id="btn-menu-mobile"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white/60 hover:bg-white/80 text-blue-900 border border-white/30 transition shadow-sm"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Slide-out Menu */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-blue-950/20 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[280px] bg-white/80 backdrop-blur-xl border-r border-white/20 z-50 transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-blue-100/30 bg-white/40">
          <span className="font-extrabold text-blue-900 text-sm">เมนูเรียนออนไลน์</span>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400">
            <X size={18} />
          </button>
        </div>
        <div className="h-[calc(100vh-60px)] overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block w-64 bg-white/40 backdrop-blur-xl border-r border-white/20 h-screen shrink-0 sticky top-0 overflow-y-auto shadow-sm">
        <SidebarContent />
      </div>
    </>
  );
}
