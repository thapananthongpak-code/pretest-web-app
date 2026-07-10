import { Database, Sparkles, Cpu, Award, Play, Camera, Download, Brain, HelpCircle, ArrowRight } from "lucide-react";

interface ContentTabsProps {
  currentTab: "content-tab1" | "content-tab2";
  onTabChange: (tab: "content-tab1" | "content-tab2") => void;
}

export default function ContentTabs({ currentTab, onTabChange }: ContentTabsProps) {
  
  // 5 Stages of Machine Learning
  const mlStages = [
    {
      num: "01",
      title: "การเก็บรวบรวมข้อมูล (Data Collection)",
      icon: Database,
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
      desc: "เปรียบเหมือนการรวบรวมตำราเรียน คอมพิวเตอร์ต้องใช้ข้อมูลจำนวนมากในการศึกษา เช่น รูปภาพสุนัข/แมว, ตัวเลขสภาพภูมิอากาศ หรือประวัติคนไข้ ยิ่งข้อมูลหลากหลายและเยอะเท่าใด เครื่องก็จะสามารถคาดคะเนได้ถูกต้องมากขึ้นเท่านั้น 📂"
    },
    {
      num: "02",
      title: "การเตรียมและทำความสะอาดข้อมูล (Data Preparation)",
      icon: Sparkles,
      bg: "bg-sky-100",
      text: "text-sky-800",
      border: "border-sky-200",
      desc: "ข้อมูลดิบมักจะมีสิ่งปนเปื้อน เช่น รูปภาพที่เบลอ ข้อมูลที่พิมพ์ผิด หรือข้อมูลซ้ำซ้อน เราจึงต้องลบส่วนที่ไม่ดีทิ้ง ปรับสัดส่วนขนาดภาพให้เท่ากัน และตั้งป้ายกำกับ (Labels) ให้ชัดเจน ข้อมูลสะอาด = โมเดลแม่นยำ 🧼"
    },
    {
      num: "03",
      title: "การเลือกรูปแบบหรือโมเดล (Model Selection)",
      icon: Brain,
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      border: "border-indigo-200",
      desc: "โมเดลเปรียบเหมือนสมองหรือสูตรคณิตศาสตร์ของคอมพิวเตอร์ เราต้องเลือกใช้อัลกอริทึมที่ตรงกับลักษณะปัญหา เช่น ถ้าต้องการแบ่งหมวดหมู่รูปภาพให้เลือกโครงข่ายประสาทเทียม (Neural Network) หรือหากต้องการทำนายยอดขายให้ใช้สมการถดถอย (Regression) 🧠"
    },
    {
      num: "04",
      title: "การฝึกสอนโมเดล (Model Training)",
      icon: Cpu,
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
      desc: "นี่คือหัวใจหลัก! เราป้อนข้อมูลที่เตรียมไว้เข้าไปยังโมเดลเพื่อให้ระบบคำนวณ ปรับค่าตัวแปรเบื้องหลังซ้ำแล้วซ้ำเล่าจนกว่าจะทายผลข้อมูลได้ถูกต้อง เปรียบเหมือนกับการที่นักเรียนทำโจทย์ข้อสอบเก่าซ้ำๆ เพื่อเตรียมตัวสอบจริง 🏋️"
    },
    {
      num: "05",
      title: "การประเมินประสิทธิภาพ (Model Evaluation)",
      icon: Award,
      bg: "bg-rose-100",
      text: "text-rose-800",
      border: "border-rose-200",
      desc: "นำข้อมูลชุดใหม่ที่โมเดลไม่เคยเห็นมาก่อนมาให้ลองทำนาย เพื่อประเมินว่าคอมพิวเตอร์เรียนรู้สำเร็จจริงหรือไม่ หากทายถูกเกิน 80% แสดงว่าโมเดลนั้นแม่นยำพร้อมใช้งาน (Accuracy) หากยังผิดพลาดบ่อย ต้องกลับไปเก็บข้อมูลเพิ่มหรือเลือกโมเดลใหม่ 📊"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 relative z-10 flex flex-col">
      
      {/* Tab Switch Buttons inside Page for easier navigation */}
      <div className="flex gap-2 p-1.5 bg-white/40 backdrop-blur-md rounded-2xl mb-6 w-fit border border-white self-center shadow-md">
        <button
          id="btn-content-tab1-switch"
          onClick={() => onTabChange("content-tab1")}
          className={`px-5 py-2.5 text-xs font-black transition-all duration-300 cursor-pointer rounded-xl ${
            currentTab === "content-tab1"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-blue-900/60 hover:text-blue-900"
          }`}
        >
          📁 ขั้นตอนการทำงานของ ML
        </button>
        <button
          id="btn-content-tab2-switch"
          onClick={() => onTabChange("content-tab2")}
          className={`px-5 py-2.5 text-xs font-black transition-all duration-300 cursor-pointer rounded-xl ${
            currentTab === "content-tab2"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-blue-900/60 hover:text-blue-900"
          }`}
        >
          📷 Teachable Machine
        </button>
      </div>

      {currentTab === "content-tab1" ? (
        /* Tab 1 Content */
        <div className="space-y-6">
          <div className="text-center mb-6">
            <span className="px-3.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-black rounded-full uppercase tracking-wider shadow-xs">
              แท็บเนื้อหาที่ 1
            </span>
            <h2 className="text-2xl font-black text-blue-900 mt-2 leading-tight">
              ขั้นตอนการทำงานของการเรียนรู้ของเครื่อง
            </h2>
            <p className="text-sm text-blue-700/60 font-semibold mt-1">
              กว่าคอมพิวเตอร์จะกลายเป็นปัญญาประดิษฐ์อัจฉริยะ ต้องผ่านกระบวนการหลัก 5 ขั้นตอนนี้
            </p>
          </div>

          <div className="space-y-5">
            {mlStages.map((stage, index) => {
              const IconComp = stage.icon;
              return (
                <div
                  key={stage.num}
                  id={`stage-card-${index}`}
                  className="bg-white/40 backdrop-blur-2xl border border-white rounded-[32px] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] flex flex-col md:flex-row gap-5 items-start relative overflow-hidden group"
                >
                  {/* Icon section with dynamic colors */}
                  <div className={`p-4 rounded-2xl ${stage.bg} ${stage.text} border ${stage.border} shrink-0 animate-float shadow-xs`}>
                    <IconComp size={32} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${stage.bg} ${stage.text}`}>
                        ขั้นตอนที่ {stage.num}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-blue-900 leading-snug">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div 
            className="p-6 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[32px] text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="text-lg font-black">เรียนรู้เสร็จแล้วใช่ไหม? 🚀</h4>
              <p className="text-xs text-blue-100 font-medium">ไปศึกษาตัวอย่างการทำเครื่องจำแนกภาพถ่ายด้วย Teachable Machine ต่อกันเลย!</p>
            </div>
            <button
              id="btn-go-to-tab2"
              onClick={() => onTabChange("content-tab2")}
              className="py-3 px-6 bg-white text-blue-700 font-black hover:scale-105 transition-all duration-300 cursor-pointer shadow-md flex items-center gap-2 shrink-0 rounded-2xl"
            >
              <span>ศึกษาต่อขั้นตอน Teachable Machine</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Tab 2 Content */
        <div className="space-y-6">
          <div className="text-center mb-6">
            <span className="px-3.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-black rounded-full uppercase tracking-wider shadow-xs">
              แท็บเนื้อหาที่ 2
            </span>
            <h2 className="text-2xl font-black text-blue-900 mt-2 leading-tight">
              ตัวอย่างการสอนเครื่องด้วย Teachable Machine
            </h2>
            <p className="text-sm text-blue-700/60 font-semibold mt-1">
              เรียนรู้วิธีการใช้แพลตฟอร์มสร้างโมเดลจำแนกรูปภาพอย่างง่ายจาก Google
            </p>
          </div>

          {/* Intro to Teachable Machine */}
          <div 
            className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-8 border border-white shadow-2xl relative overflow-hidden group"
          >
            <h3 className="text-lg font-black text-blue-900 flex items-center gap-2">
              <span className="text-xl">💡</span> Teachable Machine คืออะไร?
            </h3>
            <p className="text-sm text-blue-800/80 font-medium leading-relaxed mt-2">
              <strong>Teachable Machine</strong> คือบริการเว็บไซต์ทดลองเชิงปฏิบัติการจาก Google 
              ที่ถูกออกแบบมาให้ผู้เริ่มเรียน AI สามารถสร้างโมเดลสำหรับจดจำรูปภาพ เสียง หรือท่าทางได้โดยไม่จำเป็นต้องพิมพ์โค้ดแม้แต่บรรทัดเดียว! 
              ใช้งานง่ายเพียงผ่านเว็บแคมของแล็ปท็อปหรือโทรศัพท์มือถือของคุณ
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              
              <div className="p-4 rounded-[24px] bg-amber-50/70 border border-amber-100/60 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Camera size={20} />
                </div>
                <h4 className="text-sm font-black text-blue-950">1. เก็บรวบรวม (Gather)</h4>
                <p className="text-xs text-blue-900/60 font-semibold leading-relaxed">
                  สร้าง Classes และอัปโหลดไฟล์รูปภาพหรือเปิดเว็บแคมป้อนรูปวัตถุที่ต้องการสอน
                </p>
              </div>

              <div className="p-4 rounded-[24px] bg-indigo-50/70 border border-indigo-100/60 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Brain size={20} />
                </div>
                <h4 className="text-sm font-black text-blue-950">2. เรียนรู้ (Train Model)</h4>
                <p className="text-xs text-blue-900/60 font-semibold leading-relaxed">
                  กดปุ่มสอน คอมพิวเตอร์จะเรียนรู้คุณลักษณะเด่นของแต่ละคลาสอย่างรวดเร็ว
                </p>
              </div>

              <div className="p-4 rounded-[24px] bg-emerald-50/70 border border-emerald-100/60 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Download size={20} />
                </div>
                <h4 className="text-sm font-black text-blue-950">3. นำไปใช้งาน (Export)</h4>
                <p className="text-xs text-blue-900/60 font-semibold leading-relaxed">
                  ทดสอบผลลัพธ์ผ่านตัวอย่างสดๆ และส่งออกโมเดลไปพัฒนาแอปจริงได้ฟรี
                </p>
              </div>

            </div>
          </div>

          {/* YouTube Video Section */}
          <div 
            className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-6 border border-white shadow-2xl relative overflow-hidden group space-y-4"
          >
            <div className="flex items-center justify-between gap-4 border-b border-blue-100/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                  <Play size={16} />
                </div>
                <h4 className="text-sm font-black text-blue-900">
                  วิดีโอสื่อการเรียนรู้หลัก: วิธีการใช้งาน Teachable Machine
                </h4>
              </div>
              <span className="text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-black">
                YouTube
              </span>
            </div>

            {/* Responsive Iframe Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-black">
              <iframe
                id="youtube-embed"
                className="absolute top-0 left-0 w-full h-full border-0"
                src="https://www.youtube.com/embed/CDHdtN3bGrM"
                title="Teachable Machine Video Lesson"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            
            <div className="flex gap-2 items-start text-xs text-blue-900/50 font-semibold">
              <HelpCircle size={14} className="shrink-0 text-blue-500 mt-0.5" />
              <span>
                คำแนะนำ: รับชมวิดีโอเพื่อความเข้าใจกระบวนการทดลองสร้างโมเดล Machine Learning ของจริงจากวิทยากรอย่างเป็นขั้นตอน
              </span>
            </div>
          </div>

          <div 
            className="p-6 rounded-[24px] bg-amber-100/60 border border-amber-200/50 flex items-center gap-4"
          >
            <span className="text-3xl">🎮</span>
            <div>
              <h4 className="text-sm font-black text-blue-950">เตรียมตัวสำหรับกิจกรรมความรู้!</h4>
              <p className="text-xs text-blue-900/70 font-semibold leading-snug mt-0.5">
                ตอนนี้คุณเข้าใจแนวคิดและกระบวนการทำงานของ Machine Learning แล้ว สเต็ปต่อไปร่วมทดลองเล่น **เกมจับคู่ท้าประลองปัญญา** ได้ในเมนูถัดไปนะครับ!
              </p>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
