import { useState, useEffect, useRef } from "react";
import { Timer, AlertTriangle, ChevronRight, CheckCircle } from "lucide-react";
import { Question } from "../types";
import { rawQuestions } from "../data/questions";

interface PreTestProps {
  onComplete: (score: number) => void;
}

export default function PreTest({ onComplete }: PreTestProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = rawQuestions[currentIdx];

  // Start timer for the current question
  useEffect(() => {
    setTimeLeft(20);
    setSelectedAnswer(null);

    // Clear previous timer
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finished! Auto-advance
          handleNext(true);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx]);

  const handleSelectOption = (option: string) => {
    if (selectedAnswer !== null) return; // Prevent double selecting
    setSelectedAnswer(option);
  };

  const handleNext = (isTimeout = false) => {
    const finalAnswer = isTimeout ? "" : selectedAnswer || "";
    const newAnswers = [...answers, finalAnswer];
    setAnswers(newAnswers);

    if (currentIdx < rawQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Test complete! Calculate score
      if (timerRef.current) clearInterval(timerRef.current);
      
      let finalScore = 0;
      newAnswers.forEach((ans, index) => {
        if (ans === rawQuestions[index].correctAnswer) {
          finalScore++;
        }
      });

      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          title: "สอบก่อนเรียนเรียบร้อย!",
          html: `<div class="text-sm font-sans">คุณทำแบบทดสอบก่อนเรียนครบแล้ว <br/> ได้คะแนน: <strong class="text-indigo-600 text-lg">${finalScore} / 10 คะแนน</strong><br/><br/>ระบบได้ปลดล็อกเนื้อหาบทเรียน กิจกรรม และเกมจับคู่ให้คุณเรียบร้อยแล้ว เข้าศึกษาต่อได้เลย! 🎉</div>`,
          icon: "success",
          confirmButtonText: "เข้าสู่บทเรียน",
          confirmButtonColor: "#4f46e5",
          customClass: {
            popup: 'rounded-2xl font-sans'
          }
        }).then(() => {
          onComplete(finalScore);
        });
      });
    }
  };

  // Percent progress for the timer
  const timerPercentage = (timeLeft / 20) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 relative z-10">
      
      {/* Quiz Progress & Timer Status */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="px-3.5 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full shadow-xs">
            📋 แบบทดสอบก่อนเรียน (Pre-test)
          </span>
          <h2 className="text-sm font-black text-blue-900/60 mt-2">
            คำถามข้อที่ {currentIdx + 1} จาก {rawQuestions.length}
          </h2>
        </div>

        {/* Timer count badge */}
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white py-1.5 px-3 rounded-2xl shadow-sm">
          <Timer size={16} className={`shrink-0 ${timeLeft <= 5 ? "text-rose-500 animate-bounce" : "text-amber-500"}`} />
          <span className={`font-mono font-black text-sm ${timeLeft <= 5 ? "text-rose-600" : "text-blue-900"}`}>
            {timeLeft} วินาที
          </span>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full h-2.5 bg-blue-100/40 rounded-full overflow-hidden mb-6 border border-white/50">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            timeLeft <= 5 ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-amber-400 to-amber-500"
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      {/* Question Card */}
      <div 
        className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-6 md:p-8 border border-white shadow-2xl relative overflow-hidden group"
      >
        <span className="text-[11px] text-blue-800 font-extrabold tracking-wider uppercase bg-blue-100 px-2.5 py-1 rounded-md inline-block mb-3">
          โจทย์คำถาม
        </span>
        <h3 className="text-lg md:text-xl font-black text-blue-900 leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Answer choices */}
        <div className="mt-8 space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const letters = ["ก.", "ข.", "ค.", "ง."];
            const isSelected = selectedAnswer === option;
            
            return (
              <button
                key={idx}
                id={`btn-pre-opt-${idx}`}
                onClick={() => handleSelectOption(option)}
                className={`w-full flex items-start gap-4 p-4 text-left border rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-102"
                    : "bg-white/85 hover:bg-white border-blue-100 hover:border-blue-400 text-blue-900 font-bold hover:scale-101 hover:shadow-xs"
                }`}
              >
                <span 
                  className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center font-black text-xs ${
                    isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {letters[idx]}
                </span>
                <span className="text-sm md:text-base font-bold leading-tight">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer actions inside card */}
        <div className="mt-8 pt-6 border-t border-blue-100/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-blue-900/50 font-bold text-xs">
            {timeLeft <= 5 ? (
              <>
                <AlertTriangle size={14} className="text-rose-500 animate-pulse" />
                <span className="text-rose-500">ใกล้หมดเวลาแล้ว!</span>
              </>
            ) : (
              <span>โปรดตอบคำถามก่อนเวลาหมด</span>
            )}
          </div>

          <button
            id="btn-pre-next"
            onClick={() => handleNext(false)}
            disabled={selectedAnswer === null}
            className={`py-3 px-6 text-sm font-black shadow-md flex items-center gap-1.5 transition-all duration-300 cursor-pointer rounded-2xl ${
              selectedAnswer === null
                ? "bg-slate-100/60 text-slate-400 cursor-not-allowed border border-slate-200/30 shadow-none"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
            }`}
          >
            <span>{currentIdx < rawQuestions.length - 1 ? "ข้อถัดไป" : "ส่งกระดาษคำตอบ"}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
