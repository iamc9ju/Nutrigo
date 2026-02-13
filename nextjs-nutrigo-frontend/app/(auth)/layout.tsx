import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#FFFCF2] relative">

            {/* ← Back to Home Button (Top-Left, Always Visible) */}
            <Link
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md text-[#3d3522] px-4 py-2.5 rounded-full shadow-md border border-[#f0e6cc]/60 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-semibold">หน้าหลัก</span>
            </Link>

            {/* Left Side - Image/Branding */}
            <div
                className="hidden lg:flex w-1/2 bg-cover bg-center items-end justify-start p-16 relative overflow-hidden sticky top-0 h-screen"
                style={{ backgroundImage: "url('/images/login-bg5.jpg')" }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"></div>

                <div className="z-10 relative max-w-lg">
                    {/* Logo Pill */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest border border-white/10">
                        <span className="w-2 h-2 bg-[#C6E065] rounded-full"></span>
                        NutriGo Health Platform
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 font-sans tracking-tight leading-[1.1]">
                        ดูแล<br />
                        <span className="text-[#C6E065]">สุขภาพของคุณ</span><br />
                        อย่างเข้าใจ
                    </h1>

                    <p className="text-lg text-white/60 font-light leading-relaxed max-w-sm">
                        ปรึกษาโภชนาการเฉพาะบุคคล วางแผนมื้ออาหาร และติดตามสุขภาพได้ในที่เดียว
                    </p>

                    {/* Feature highlights */}
                    <div className="flex items-center gap-5 mt-8 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="text-[#C6E065] text-sm">✓</span>
                            <span className="text-sm text-white/60">วางแผนมื้ออาหาร</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#C6E065] text-sm">✓</span>
                            <span className="text-sm text-white/60">ปรึกษาผู้เชี่ยวชาญ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-[#FFFCF2] relative overflow-hidden">
                {/* Playful Geometric Shapes */}
                <div className="absolute top-16 right-20 w-16 h-16 bg-[#C6E065]/15 rounded-full"></div>
                <div className="absolute top-40 right-10 w-8 h-8 bg-[#FFD699]/20 rounded-lg rotate-12"></div>
                <div className="absolute bottom-28 left-16 w-12 h-12 bg-[#C6E065]/10 rounded-xl rotate-45"></div>
                <div className="absolute bottom-16 right-28 w-20 h-20 border-2 border-[#e8d5a8]/20 rounded-full"></div>
                <div className="absolute top-1/3 left-10 w-6 h-6 bg-[#FFB366]/10 rounded-full"></div>
                {/* Tiny triangles */}
                <svg className="absolute top-24 left-20 w-8 h-8 opacity-[0.08]" viewBox="0 0 24 24" fill="#4A6707">
                    <polygon points="12,2 22,22 2,22" />
                </svg>
                <svg className="absolute bottom-36 right-14 w-6 h-6 opacity-[0.06]" viewBox="0 0 24 24" fill="#C6E065">
                    <polygon points="12,2 22,22 2,22" />
                </svg>

                <div className="w-full max-w-sm relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
