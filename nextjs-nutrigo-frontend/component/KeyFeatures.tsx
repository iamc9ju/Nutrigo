import { ClipboardList, UserCheck, TrendingUp, ChefHat, HeartPulse } from "lucide-react";

const features = [
    { icon: ClipboardList, title: "แผนโภชนาการเฉพาะบุคคล", desc: "บรรลุเป้าหมายสุขภาพของคุณด้วยแผนอาหารที่ออกแบบมาเพื่อคุณโดยเฉพาะ" },
    { icon: UserCheck, title: "ปรึกษาผู้เชี่ยวชาญ", desc: "รับคำแนะนำด้านอาหารและการติดตามผลอย่างใกล้ชิดจากผู้เชี่ยวชาญ" },
    { icon: TrendingUp, title: "ติดตามผลลัพธ์", desc: "ติดตามทุกความคืบหน้าเพื่อการมีสุขภาพดีในระยะยาว" },
    { icon: ChefHat, title: "อาหารเพื่อสุขภาพ", desc: "รวมอาหารที่เหมาะสมและดีต่อสุขภาพไว้ให้คุณ" },
    { icon: HeartPulse, title: "ก้าวไปพร้อมกัน", desc: "สร้างแรงบันดาลใจและบรรลุเป้าหมายสุขภาพไปพร้อมกับคอมมูนิตี้" },
];

export default function KeyFeatures() {
    return (
        <section className="py-20 bg-transparent">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-lg text-gray-500 mb-2">บริการของเรา</h3>
                    <h2 className="text-4xl font-bold">เลือกเราเพื่อสุขภาพที่ดีอย่างยั่งยืน</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-start gap-4">
                            <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center text-lime-700">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold">{feature.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}