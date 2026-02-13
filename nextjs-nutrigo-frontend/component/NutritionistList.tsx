import { Star } from "lucide-react";
import Button from "./Button";

const nutritionists = [
    {
        name: "ดร. Sarah Jenkins",
        title: "นักโภชนาการการกีฬา",
        rating: 4.8,
        reviews: 180,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        name: "ดร. Rella Dhooks",
        title: "ผู้เชี่ยวชาญการควบคุมน้ำหนัก",
        rating: 4.9,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        name: "ดร. Korah Jenins",
        title: "นักกำหนดอาหารคลินิก",
        rating: 4.7,
        reviews: 150,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200"
    }
];

export default function NutritionistList() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-[#f8fbe8] relative overflow-hidden">
            <div className="absolute top-6 left-6 text-6xl opacity-20 rotate-12 select-none pointer-events-none">🥑</div>
            <div className="absolute top-16 right-10 text-5xl opacity-20 -rotate-6 select-none pointer-events-none">🍎</div>
            <div className="absolute bottom-12 left-16 text-5xl opacity-20 rotate-[-20deg] select-none pointer-events-none">🥕</div>
            <div className="absolute bottom-8 right-20 text-6xl opacity-15 rotate-12 select-none pointer-events-none">🍋</div>
            <div className="absolute top-1/2 left-1/3 text-4xl opacity-10 rotate-[30deg] select-none pointer-events-none">🥬</div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-gray-900">พบกับนักโภชนาการของเรา</h2>
                    <p className="text-gray-500">ทีมผู้เชี่ยวชาญที่พร้อมดูแลสุขภาพของคุณ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {nutritionists.map((person, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl shadow-md border border-[#e8f0d0] hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#C6E065]/30 shadow-lg group-hover:border-[#C6E065] transition-colors">
                                        <img
                                            src={person.image}
                                            alt={person.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg text-gray-900 mb-1">{person.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 font-medium">{person.title}</p>

                                <Button variant="outline" className="rounded-full px-8 py-2 border-[#8BC34A] text-[#4A6707] font-bold hover:bg-[#C6E065] hover:text-white hover:border-[#C6E065] text-sm w-full max-w-[140px] transition-all">
                                    ดูโปรไฟล์
                                </Button>

                                <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{person.rating} ({person.reviews} รีวิว)</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Button variant="outline" size="lg" className="border-[#8BC34A] text-[#4A6707] hover:bg-[#C6E065] hover:text-white hover:border-[#C6E065]">
                        ดูนักโภชนาการทั้งหมด
                    </Button>
                </div>
            </div>
        </section>
    );
}