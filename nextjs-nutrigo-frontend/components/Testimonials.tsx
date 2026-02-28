import { Quote } from "lucide-react";

const reviews = [
  {
    text: "ฉันลดน้ำหนักได้ 5 กิโลใน 2 เดือน โดยไม่ต้องอดอาหารเลย นักโภชนาการดูแลดีมาก",
    author: "พิมพ์ชนก สุดา",
    role: "พนักงานออฟฟิศ",
    initial: "P",
  },
  {
    text: "ชอบที่แอปใช้ง่ายมาก และแผนอาหารก็ทำตามได้จริง ไม่ยุ่งยากอย่างที่คิด",
    author: "ณัฐวุฒิ ใจดี",
    role: "Freelance",
    initial: "N",
  },
  {
    text: "รู้สึกสุขภาพดีขึ้นมาก ค่าเลือดดีขึ้นหลังจากทำตามคำแนะนำมา 3 เดือน",
    author: "สมชาย มีสุข",
    role: "เจ้าของกิจการ",
    initial: "S",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#f4f9e6] relative overflow-hidden">
      <div className="absolute top-10 right-12 text-6xl opacity-15 rotate-[25deg] select-none pointer-events-none">
        🍊
      </div>
      <div className="absolute bottom-10 left-8 text-6xl opacity-15 -rotate-12 select-none pointer-events-none">
        🥦
      </div>
      <div className="absolute top-1/2 right-4 text-5xl opacity-10 rotate-45 select-none pointer-events-none">
        🍇
      </div>
      <div className="absolute top-8 left-1/3 text-4xl opacity-10 rotate-[-10deg] select-none pointer-events-none">
        🍓
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            เสียงจากผู้ใช้งานจริง
          </h2>
          <p className="text-gray-500">
            ผลลัพธ์ที่พิสูจน์ได้จากสมาชิกครอบครัว NutriGo
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-md border border-[#e8f0d0] hover:shadow-xl hover:-translate-y-1 transition-all relative group"
            >
              <Quote className="text-[#C6E065] mb-4 w-8 h-8 opacity-40 group-hover:opacity-70 transition-opacity" />
              <p className="text-gray-600 mb-6 leading-relaxed">
                {review.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C6E065] to-[#8BC34A] flex items-center justify-center text-white font-bold shadow-sm">
                  {review.initial}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">
                    {review.author}
                  </h4>
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
