import Link from "next/link";
import Button from "./Button";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 p-4 border-b-2 border-gray-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <div className="w-6 h-3 bg-[#FDB813] rounded-b-full"></div>
                        <div className="w-6 h-3 bg-[#8BC34A] rounded-b-full"></div>
                    </div>
                    <div className="text-2xl font-bold font-sans">
                        <span className="text-black">Well</span>
                        <span className="text-[#8BC34A]">Mate</span>
                    </div>
                </div>

                {/* Menu */}
                <div className="hidden md:flex items-center gap-8 font-medium">
                    <Link href="/" className="px-4 py-2 bg-gray-100 rounded-full">หน้าหลัก</Link>
                    <Link href="#" className="hover:text-primary">บริการ</Link>
                    <Link href="#" className="hover:text-primary">ข่าวสาร</Link>
                    <Link href="#" className="hover:text-primary">เกี่ยวกับเรา</Link>
                </div>
                {/* Buttons */}
                <div className="flex items-center gap-4">
                    <Button className="px-6 py-2 bg-white text-black border-2 border-black rounded-xl font-bold hover:bg-gray-50 transition-all">
                        เข้าสู่ระบบ
                    </Button>
                    <Button className="px-6 py-2 bg-white text-black border-2 border-black rounded-xl font-bold  transition-all bg-[#a3d133]">
                        สมัครสมาชิก
                    </Button>
                </div>
            </div>
        </nav>
    );
}