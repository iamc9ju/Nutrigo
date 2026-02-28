import { Plus } from "lucide-react";

export default function FAQ() {
  const questions = [
    "ต้องทำอาหารทานเองทุกมื้อไหม?",
    "สามารถปรึกษานักโภชนาการได้บ่อยแค่ไหน?",
    "ถ้ามีโรคประจำตัวสามารถใช้บริการได้ไหม?",
    "ราคาเริ่มต้นเท่าไหร่?",
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-6 left-4 text-5xl opacity-15 rotate-[-15deg] select-none pointer-events-none">
        🍅
      </div>
      <div className="absolute bottom-6 right-8 text-6xl opacity-15 rotate-[20deg] select-none pointer-events-none">
        🌽
      </div>
      <div className="absolute top-1/2 left-2 text-5xl opacity-10 rotate-12 select-none pointer-events-none">
        🫐
      </div>
      <div className="absolute top-1/3 right-4 text-4xl opacity-10 -rotate-6 select-none pointer-events-none">
        🥒
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          คำถามที่พบบ่อย
        </h2>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="bg-[#fafdf0] border border-[#e8f0d0] rounded-xl p-6 flex justify-between items-center hover:border-[#C6E065] hover:shadow-md cursor-pointer transition-all group"
            >
              <span className="font-medium text-gray-700">{q}</span>
              <Plus className="text-gray-400 group-hover:text-[#8BC34A] transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
