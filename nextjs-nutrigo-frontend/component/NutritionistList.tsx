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
        <section className="py-20 bg-transparent">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">พบกับนักโภชนาการของเรา</h2>
                    <p className="text-gray-500">ทีมผู้เชี่ยวชาญที่พร้อมดูแลสุขภาพของคุณ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {nutritionists.map((person, idx) => (
                        <div key={idx} className="border border-gray-100 p-6 rounded-2xl bg-white hover:border-lime-200 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4">
                                    <img
                                        src={person.image}
                                        alt={person.name}
                                        className="w-16 h-16 rounded-full object-cover bg-gray-100"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg">{person.name}</h3>
                                        <p className="text-xs text-gray-500 mb-1">CCS, DM</p>
                                        <p className="text-sm text-gray-600">{person.title}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs px-3 py-1">ดูโปรไฟล์</Button>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold text-sm">{person.rating}</span>
                                <span className="text-gray-400 text-sm">({person.reviews} รีวิว)</span>
                            </div>

                            <p className="text-sm text-gray-500 line-clamp-2">
                                ผู้เชี่ยวชาญด้านสุขภาพที่มีประสบการณ์กว่า 10 ปี ในการดูแลโภชนาการและการวางแผนอาหารเพื่อสุขภาพที่ดี
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Button variant="outline" size="lg">
                        ดูนักโภชนาการทั้งหมด
                    </Button>
                </div>
            </div>
        </section>
    );
}