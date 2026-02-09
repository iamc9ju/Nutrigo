import { Quote } from "lucide-react";

const reviews = [
    {
        text: "ฉันลดน้ำหนักได้ 5 กิโลใน 2 เดือน โดยไม่ต้องอดอาหารเลย นักโภชนาการดูแลดีมาก",
        author: "พิมพ์ชนก สุดา",
        role: "พนักงานออฟฟิศ",
        initial: "P"
    },
    {
        text: "ชอบที่แอปใช้ง่ายมาก และแผนอาหารก็ทำตามได้จริง ไม่ยุ่งยากอย่างที่คิด",
        author: "ณัฐวุฒิ ใจดี",
        role: "Freelance",
        initial: "N"
    },
    {
        text: "รู้สึกสุขภาพดีขึ้นมาก ค่าเลือดดีขึ้นหลังจากทำตามคำแนะนำมา 3 เดือน",
        author: "สมชาย มีสุข",
        role: "เจ้าของกิจการ",
        initial: "S"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">เสียงจากผู้ใช้งานจริง</h2>
                    <p className="text-gray-500">ผลลัพธ์ที่พิสูจน์ได้จากสมาชิกครอบครัว Wellmate</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                            <Quote className="text-[#A3D133] mb-4 w-8 h-8 opacity-50" />
                            <p className="text-gray-600 mb-6 leading-relaxed">{review.text}</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#A3D133] flex items-center justify-center text-black font-bold">
                                    {review.initial}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{review.author}</h4>
                                    <p className="text-xs text-gray-500">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}