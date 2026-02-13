import { Facebook, Instagram, Twitter, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#f8fbe8] text-gray-600 py-16 border-t border-[#e0ecb8] relative overflow-hidden">
            <div className="absolute bottom-4 right-6 text-5xl opacity-10 rotate-12 select-none pointer-events-none">🥗</div>
            <div className="absolute top-6 left-10 text-5xl opacity-10 -rotate-6 select-none pointer-events-none">🍏</div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">
                            <span className="text-[#8BC34A]">Nutri</span>
                            <span className="text-[#FDB813]">Go</span>
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            เพื่อนคู่คิดด้านสุขภาพของคุณ<br />เพื่อชีวิตที่ดีอย่างยั่งยืน
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-[#8BC34A] transition-colors"><Facebook size={18} /></a>
                            <a href="#" className="text-gray-400 hover:text-[#8BC34A] transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="text-gray-400 hover:text-[#8BC34A] transition-colors"><Twitter size={18} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">เมนู</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-[#8BC34A] transition-colors">หน้าแรก</a></li>
                            <li><a href="#" className="hover:text-[#8BC34A] transition-colors">ฟีเจอร์</a></li>
                            <li><a href="#" className="hover:text-[#8BC34A] transition-colors">นักโภชนาการ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">ช่วยเหลือ</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-[#8BC34A] transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-[#8BC34A] transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-[#8BC34A] transition-colors">Terms</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">ติดต่อ</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-[#8BC34A]" />
                                <span>สาทรซิตี้, กรุงเทพฯ</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-[#8BC34A]" />
                                <span>02-123-4567</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#dfe8c0] pt-8 flex justify-center md:justify-between items-center text-xs text-gray-400">
                    <p>&copy; 2024 NutriGo. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}