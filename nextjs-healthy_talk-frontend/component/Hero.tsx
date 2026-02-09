import Button from "./Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
    return (
        <section className="pt-32 pb-20 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center">

                {/* Badge
                <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-800 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-fade-in-up">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                    </span>
                    แพลตฟอร์มดูแลสุขภาพอันดับ 1
                </div> */}

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 leading-tight">
                    สุขภาพดีเริ่มต้นที่<br />
                    <span className="text-[#A3D133]">Wellmate Platform</span>
                </h1>

                {/* Subheadline */}
                <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    บริหารจัดการโภชนาการ ปรึกษาผู้เชี่ยวชาญ และติดตามผลลัพธ์สุขภาพของคุณได้ครบจบในที่เดียว ผ่านเว็บบราวเซอร์ ไม่ต้องลงแอป
                </p>

                {/* Dashboard Image Showcase */}
                <div className="relative mx-auto max-w-6xl">
                    {/* Glow Effect */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-lime-400/20 blur-[100px] rounded-full -z-10"></div>

                    <div className="bg-gray-400 rounded-2xl p-2 shadow-2xl border border-gray-200/50 backdrop-blur-sm">
                        <div className="bg-gray-500 rounded-xl overflow-hidden relative"> {/* ลบ aspect-[16/9] ออก */}
                            <img
                                src="/dashboard-mockup.png"
                                alt="Wellmate Dashboard Interface"
                                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity duration-700" /* ใช้ h-auto แทน h-full */
                            />
                        </div>
                    </div>

                    {/* Feature Tags Floating
                    <div className="hidden md:flex absolute -left-12 top-1/4 bg-white p-3 rounded-xl shadow-lg items-center gap-3 animate-bounce-slow">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600"><CheckCircle2 size={20} /></div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500 font-bold">Status</p>
                            <p className="text-sm font-bold text-gray-800">Healthy</p>
                        </div>
                    </div> */}
                </div>


            </div>
        </section>
    );
}