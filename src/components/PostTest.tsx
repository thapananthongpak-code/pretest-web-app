import { useState, useEffect, useRef } from "react";
import { Timer, AlertTriangle, ChevronRight, Award } from "lucide-react";
import { Question } from "../types";
import { getPostTestQuestions } from "../data/questions";

interface PostTestProps {
  onComplete: (score: number) => void;
}

export default function PostTest({ onComplete }: PostTestProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize questions with shuffled options on mount
  useEffect(() => {
    setQuestions(getPostTestQuestions());
  }, []);

  // Start timer for the current question
  useEffect(() => {
    if (questions.length === 0) return;
    
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
  }, [currentIdx, questions]);

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (option: string) => {
    if (selectedAnswer !== null) return; // Prevent double selecting
    setSelectedAnswer(option);
  };

  const handleNext = (isTimeout = false) => {
    const finalAnswer = isTimeout ? "" : selectedAnswer || "";
    const newAnswers = [...answers, finalAnswer];
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Test complete! Calculate score
      if (timerRef.current) clearInterval(timerRef.current);
      
      let finalScore = 0;
      newAnswers.forEach((ans, index) => {
        if (ans === questions[index].correctAnswer) {
          finalScore++;
        }
      });

      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          title: "สอบหลังเรียนเสร็จสิ้น! 🎉",
          html: `<div class="text-sm font-sans">คุณส่งแบบทดสอบหลังเรียนครบแล้ว <br/> ได้คะแนน: <strong class="text-rose-600 text-lg">${finalScore} / 10 คะแนน</strong><br/><br/>ระบบกำลังพาท่านไปวิเคราะห์ผลคะแนนเปรียบเทียบพัฒนาการและบันทึกลงคลาวด์!</div>`,
          icon: "success",
          confirmButtonText: "ดูผลรายงาน",
          confirmButtonColor: "#e11d48",
          customClass: {
            popup: 'rounded-2xl font-sans'
          }
        }).then(() => {
          onComplete(finalScore);
        });
      });
    }
  };

  const timerPercentage = (timeLeft / 20) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 relative z-10">
      
      {/* Quiz Progress & Timer Status */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="px-3.5 py-1.5 bg-rose-100 text-rose-900 text-xs font-black rounded-full shadow-xs">
            🏅 แบบทดสอบหลังเรียน (Post-test)
          </span>
          <h2 className="text-sm font-black text-blue-900/60 mt-2">
            คำถามข้อที่ {currentIdx + 1} จาก {questions.length}
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
      <div className="w-full h-2.5 bg-rose-100/40 rounded-full overflow-hidden mb-6 border border-white/50">
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
        <span className="text-[11px] text-rose-800 font-extrabold tracking-wider uppercase bg-rose-100 px-2.5 py-1 rounded-md inline-block mb-3">
          โจทย์คำถามหลังเรียน (สลับช้อยส์)
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
                id={`btn-post-opt-${idx}`}
                onClick={() => handleSelectOption(option)}
                className={`w-full flex items-start gap-4 p-4 text-left border rounded-2xl transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-rose-600 border-rose-600 text-white shadow-lg scale-102"
                    : "bg-white/85 hover:bg-white border-rose-100 hover:border-rose-400 text-blue-900 font-bold hover:scale-101 hover:shadow-xs"
                }`}
              >
                <span 
                  className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center font-black text-xs ${
                    isSelected ? "bg-white/20 text-white" : "bg-rose-50 text-rose-600"
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
                <span className="text-rose-500">ใกล้หมดเวลาสอบหลังเรียนแล้ว!</span>
              </>
            ) : (
              <span>โปรดคิดอย่างรอบคอบก่อนตอบ</span>
            )}
          </div>

          <button
            id="btn-post-next"
            onClick={() => handleNext(false)}
            disabled={selectedAnswer === null}
            className={`py-3 px-6 text-sm font-black shadow-md flex items-center gap-1.5 transition-all duration-300 cursor-pointer rounded-2xl ${
              selectedAnswer === null
                ? "bg-slate-100/60 text-slate-400 cursor-not-allowed border border-slate-200/30 shadow-none"
                : "bg-rose-600 hover:bg-rose-700 text-white hover:scale-105"
            }`}
          >
            <span>{currentIdx < questions.length - 1 ? "ข้อถัดไป" : "ส่งกระดาษคำตอบสุดท้าย"}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
