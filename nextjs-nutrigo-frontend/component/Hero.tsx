import Button from "./Button";
import { HeartPulse } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 min-h-[100vh] flex items-center justify-center overflow-hidden">

            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2900&auto=format&fit=crop"
                    alt="Healthy Lifestyle"
                    className="w-full h-full object-cover brightness-[0.4]"
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl leading-tight">
                    เพราะสุขภาพที่ดี<br />เริ่มต้นจาก<span className="text-[#C6E065]">มื้ออาหารที่ใช่</span>
                </h1>
                <p className="text-2xl text-gray-200 mb-10 font-light max-w-2xl mx-auto">
                    "สุขภาพดีไม่ใช่เรื่องยาก แค่มีเพื่อนคู่คิดที่ถูกใจ"
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button className="min-w-[200px] py-4 bg-[#C6E065] text-[#3d3522] rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(198,224,101,0.4)]">
                        เริ่มต้นใช้งานวันนี้
                    </Button>
                    <button className="flex items-center gap-3 text-white hover:text-[#C6E065] transition-all cursor-pointer group hover:scale-105">
                        <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-[#C6E065] group-hover:bg-white/10 transition-all">
                            <HeartPulse size={24} />
                        </div>
                        <span className="font-medium">ประเมินสุขภาพฟรี</span>
                    </button>
                </div>
            </div>


        </section>
    );
}