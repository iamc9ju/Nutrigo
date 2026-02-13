"use client";

import Link from "next/link";
import Button from "./Button";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
            <div className={`backdrop-blur-xl rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg transition-all duration-300 border ${scrolled
                ? "bg-white/90 border-gray-200 shadow-xl"
                : "bg-white/10 border-white/20"
                }`}>
                <Link href="/" className="text-2xl font-bold">
                    <span className="text-[#8BC34A]">Nutri</span>
                    <span className={`transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white"}`}>Go</span>
                </Link>

                <div className={`hidden md:flex items-center gap-6 text-sm font-medium transition-colors duration-300 ${scrolled ? "text-gray-600" : "text-gray-200"
                    }`}>
                    <Link href="/" className={`px-4 py-1.5 rounded-full transition-colors ${scrolled
                        ? "bg-[#C6E065]/20 text-[#4A6707] hover:bg-[#C6E065]/30"
                        : "bg-white/10 text-white hover:bg-white/20"
                        }`}>หน้าหลัก</Link>
                    <Link href="#" className={`hover:text-[#8BC34A] transition-colors ${scrolled ? "text-gray-600" : ""}`}>แดชบอร์ด</Link>
                    <Link href="#" className={`hover:text-[#8BC34A] transition-colors flex items-center gap-1 ${scrolled ? "text-gray-600" : ""}`}>บริการโภชนาการ <span className="text-xs">▼</span></Link>
                    <Link href="#" className={`hover:text-[#8BC34A] transition-colors flex items-center gap-1 ${scrolled ? "text-gray-600" : ""}`}>เมนูสุขภาพ <span className="text-xs">▼</span></Link>
                    <Link href="#" className={`hover:text-[#8BC34A] transition-colors ${scrolled ? "text-gray-600" : ""}`}>ความก้าวหน้า</Link>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button className={`px-5 py-2 bg-transparent rounded-full font-bold text-sm transition-all ${scrolled
                            ? "text-gray-700 border border-gray-300 hover:bg-gray-100"
                            : "text-white border border-white/30 hover:bg-white/10"
                            }`}>
                            เข้าสู่ระบบ
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="px-5 py-2 bg-[#C6E065] text-black rounded-full font-bold text-sm hover:bg-[#b5d63d] transition-all">
                            สมัครสมาชิก
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}