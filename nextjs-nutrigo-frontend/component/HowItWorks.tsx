import { Phone, Users, Salad } from "lucide-react";

const steps = [
    {
        icon: Phone,
        step: "01",
        title: "ค้นหาเมนูหรือเป้าหมาย",
        desc: "ค้นพาเมนูอาหารที่คุณสนใจ หรือเลือกเป้าหมายสุขภาพที่คุณต้องการ"
    },
    {
        icon: Users,
        step: "02",
        title: "รับคำแนะนำเฉพาะคุณ",
        desc: "รับแผนการดูแลสุขภาพและคำแนะนำที่เหมาะกับไลฟ์สไตล์ของคุณ"
    },
    {
        icon: Salad,
        step: "03",
        title: "เริ่มดูแลสุขภาพได้เลย",
        desc: "เข้าถึงคำปรึกษาและเริ่มติดตามความก้าวหน้าของคุณได้ทันที"
    }
];

export default function HowItWorks() {
    return (
        <section className="py-20 bg-transparent">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold">ขั้นตอนการใช้งาน</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            {/* Step Number Background */}
                            <div className="absolute -right-4 -top-4 text-9xl font-bold text-gray-50 opacity-50 select-none group-hover:text-lime-50 transition-colors">
                                {item.step}
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-lime-100 rounded-2xl flex items-center justify-center text-lime-700 mb-6 group-hover:bg-lime-500 group-hover:text-white transition-colors">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Step {item.step}</h3>
                                <h4 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h4>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}