import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, CheckCircle, Flame, Award, Lightbulb } from "lucide-react";

interface MatchItem {
  id: number;
  term: string;
  definition: string;
  emoji: string;
  color: string;
}

const GAME_PAIRS: MatchItem[] = [
  {
    id: 1,
    term: "การเก็บรวบรวมข้อมูล (Data Collection)",
    definition: "รวบรวมตัวอย่างวัตถุ รูปถ่าย หรือเสียงบันทึกเข้ามาสะสมไว้ในระบบ",
    emoji: "📂",
    color: "amber"
  },
  {
    id: 2,
    term: "การเตรียมข้อมูล (Data Cleansing)",
    definition: "ทำความสะอาดข้อมูลภาพที่เบลอ คัดสิ่งปนเปื้อนออก และตั้งกลุ่มคลาสให้ถูกต้อง",
    emoji: "🧼",
    color: "sky"
  },
  {
    id: 3,
    term: "การเลือกโมเดล (Model Selection)",
    definition: "เลือกชนิดสมองกลจำลองหรือสูตรคำนวณที่สอดรับกับความชอบและประเภทโจทย์",
    emoji: "🧠",
    color: "indigo"
  },
  {
    id: 4,
    term: "การสอนโมเดล (Model Training)",
    definition: "ป้อนข้อมูลให้เครื่องคอมพิวเตอร์ฝึกฝนสังเกตลวดลายซ้ำๆ จนเข้าใจรูปแบบ",
    emoji: "🏋️",
    color: "emerald"
  },
  {
    id: 5,
    term: "การประเมินผล (Model Evaluation)",
    definition: "ให้เครื่องลองทำนายรูปแปลกใหม่ที่ไม่เคยเรียนรู้ เพื่อทดสอบความแม่นยำ Accuracy",
    emoji: "📊",
    color: "rose"
  }
];

export default function InteractiveGame() {
  const [shuffledTerms, setShuffledTerms] = useState<MatchItem[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<MatchItem[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [selectedDefId, setSelectedDefId] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [mismatchedPair, setMismatchedPair] = useState<{ termId: number; defId: number } | null>(null);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize and shuffle game
  const initializeGame = () => {
    // Shuffle helper
    const shuffle = (array: any[]) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    setShuffledTerms(shuffle(GAME_PAIRS));
    setShuffledDefs(shuffle(GAME_PAIRS));
    setSelectedTermId(null);
    setSelectedDefId(null);
    setMatchedIds([]);
    setMismatchedPair(null);
    setMoves(0);
    setScore(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleTermSelect = (id: number) => {
    if (matchedIds.includes(id) || mismatchedPair) return;
    setSelectedTermId(id);

    // If description is already selected, check match
    if (selectedDefId !== null) {
      checkMatch(id, selectedDefId);
    }
  };

  const handleDefSelect = (id: number) => {
    if (matchedIds.includes(id) || mismatchedPair) return;
    setSelectedDefId(id);

    // If term is already selected, check match
    if (selectedTermId !== null) {
      checkMatch(selectedTermId, id);
    }
  };

  const checkMatch = (termId: number, defId: number) => {
    setMoves((prev) => prev + 1);

    if (termId === defId) {
      // Correct Match!
      const newMatches = [...matchedIds, termId];
      setMatchedIds(newMatches);
      setScore((prev) => prev + 20);
      setSelectedTermId(null);
      setSelectedDefId(null);

      // Check win condition
      if (newMatches.length === GAME_PAIRS.length) {
        setIsWon(true);
        import("sweetalert2").then((Swal) => {
          Swal.default.fire({
            title: "ยินดีด้วยครับ! จับคู่เก่งมาก 🎉",
            html: `<div class="text-sm font-sans">คุณจับคู่กระบวนการเรียนรู้ของเครื่องได้ครบหมดทุกขั้นตอน!<br/>จำนวนครั้งที่เดา: <strong class="text-blue-600">${moves + 1} ครั้ง</strong> <br/>ระดับความเข้าใจ: <strong class="text-emerald-600">ยอดเยี่ยม 🧠⭐</strong></div>`,
            icon: "success",
            confirmButtonText: "เล่นอีกครั้ง",
            confirmButtonColor: "#2563eb",
            customClass: {
              popup: 'rounded-2xl font-sans'
            }
          }).then(() => {
            initializeGame();
          });
        });
      }
    } else {
      // Incorrect Match
      setMismatchedPair({ termId, defId });
      
      setTimeout(() => {
        setMismatchedPair(null);
        setSelectedTermId(null);
        setSelectedDefId(null);
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 relative z-10">
      
      {/* Game Header Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-black rounded-full uppercase shadow-xs inline-block">
            🎮 เกมทดลองแสนสนุก
          </span>
          <h2 className="text-2xl font-black text-blue-900 mt-2 leading-tight">
            เกมจับคู่ขั้นตอน Machine Learning
          </h2>
          <p className="text-xs text-blue-700/70 font-semibold mt-0.5">
            ทดสอบสมองประลองปัญญาโดยคลิกจับคู่ข้อความหัวข้อและคำอธิบายที่ตรงกัน!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md py-2.5 px-4 rounded-2xl border border-white shadow-sm">
          <div className="flex items-center gap-1.5">
            <Flame size={16} className="text-orange-500" />
            <span className="text-xs text-blue-900/60 font-bold">เดาไป:</span>
            <span className="font-mono font-black text-sm text-blue-900">{moves}</span>
          </div>
          <div className="h-4 w-px bg-blue-200/30" />
          <div className="flex items-center gap-1.5">
            <Award size={16} className="text-amber-500" />
            <span className="text-xs text-blue-900/60 font-bold">ความคืบหน้า:</span>
            <span className="font-mono font-black text-sm text-emerald-600">{matchedIds.length} / {GAME_PAIRS.length}</span>
          </div>
          <button
            id="btn-reset-game"
            onClick={initializeGame}
            title="เริ่มเกมใหม่"
            className="p-1.5 hover:bg-white rounded-lg text-blue-400 hover:text-blue-600 transition cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Game Playboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Column: Terms */}
        <div className="space-y-3">
          <div className="text-xs font-black text-blue-900/40 uppercase tracking-widest px-1">
            📌 ขั้นตอนการทำงาน / คำศัพท์
          </div>
          
          {shuffledTerms.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedTermId === item.id;
            const isError = mismatchedPair?.termId === item.id;

            let cardStyle = "bg-white/80 border-blue-100 hover:border-blue-400 text-blue-900 hover:scale-101";
            if (isMatched) {
              cardStyle = "bg-emerald-100/60 border-emerald-300 text-emerald-900 scale-95 opacity-70 pointer-events-none";
            } else if (isError) {
              cardStyle = "bg-rose-100 border-rose-400 text-rose-900 animate-pulse";
            } else if (isSelected) {
              cardStyle = "bg-blue-600 border-blue-600 text-white shadow-lg scale-102";
            }

            return (
              <button
                key={item.id}
                id={`btn-game-term-${item.id}`}
                onClick={() => handleTermSelect(item.id)}
                className={`w-full flex items-center gap-3.5 p-4 text-left border rounded-2xl transition-all duration-300 cursor-pointer ${cardStyle}`}
              >
                <span className="text-2xl shrink-0">{item.emoji}</span>
                <span className="text-sm md:text-base font-bold leading-tight flex-1">
                  {item.term}
                </span>
                {isMatched && <CheckCircle size={18} className="text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Right Column: Definitions */}
        <div className="space-y-3">
          <div className="text-xs font-black text-blue-900/40 uppercase tracking-widest px-1">
            📝 คำอธิบาย / นิยามความหมาย
          </div>

          {shuffledDefs.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedDefId === item.id;
            const isError = mismatchedPair?.defId === item.id;

            let cardStyle = "bg-white/80 border-blue-100 hover:border-blue-400 text-blue-900 hover:scale-101";
            if (isMatched) {
              cardStyle = "bg-emerald-100/60 border-emerald-300 text-emerald-900 scale-95 opacity-70 pointer-events-none";
            } else if (isError) {
              cardStyle = "bg-rose-100 border-rose-400 text-rose-900 animate-pulse";
            } else if (isSelected) {
              cardStyle = "bg-blue-600 border-blue-600 text-white shadow-lg scale-102";
            }

            return (
              <button
                key={item.id}
                id={`btn-game-def-${item.id}`}
                onClick={() => handleDefSelect(item.id)}
                className={`w-full flex items-center gap-3 p-4 text-left border rounded-2xl transition-all duration-300 h-full cursor-pointer ${cardStyle}`}
              >
                <span className="text-sm font-semibold leading-relaxed flex-1">
                  {item.definition}
                </span>
                {isMatched && <CheckCircle size={18} className="text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

      </div>

      {/* Game Hints */}
      <div 
        className="mt-8 p-6 bg-amber-100/60 border border-amber-200/40 rounded-[24px] flex items-start gap-3"
      >
        <Lightbulb size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-950 font-bold leading-relaxed">
          <strong>เคล็ดลับความรู้:</strong> หากคุณจับคู่ผิด พลาดจะมีการสั่นสะเทือนเตือนสีแดง และการ์ดจะถูกรีเซ็ตใน 1 วินาที 
          ไม่จำกัดครั้งในการเล่น ยิ่งเล่นได้น้อยจำนวนคลิกและไวยิ่งบ่งชี้ว่าคุณจำขั้นตอนหลักทั้ง 5 ข้องานปัญญาประดิษฐ์ (ML) ได้แม่นขึ้น!
        </p>
      </div>

    </div>
  );
}
