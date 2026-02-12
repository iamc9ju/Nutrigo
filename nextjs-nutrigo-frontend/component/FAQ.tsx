import { Plus } from "lucide-react";

export default function FAQ() {
    const questions = [
        "ต้องทำอาหารทานเองทุกมื้อไหม?",
        "สามารถปรึกษานักโภชนาการได้บ่อยแค่ไหน?",
        "ถ้ามีโรคประจำตัวสามารถใช้บริการได้ไหม?",
        "ราคาเริ่มต้นเท่าไหร่?"
    ];

    return (
        <section className="py-20 bg-transparent">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">คำถามที่พบบ่อย</h2>
                <div className="space-y-4">
                    {questions.map((q, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:border-[#A3D133] cursor-pointer transition-all shadow-sm hover:shadow-md group">
                            <span className="font-medium">{q}</span>
                            <Plus className="text-gray-400 group-hover:text-[#A3D133]" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}