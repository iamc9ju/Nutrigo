"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Heart,
  Calendar,
  MessageSquare,
  Utensils,
  BookOpen,
  ScrollText,
  BarChart2,
  LogOut,
  UserCog,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { icon: LayoutGrid, label: "แดชบอร์ด", href: "/dashboard" },
    { icon: Heart, label: "บริการโภชนาการ", href: "/dashboard/nutrition" },
    { icon: Calendar, label: "ปฏิทิน", href: "/dashboard/calendar" },
    { icon: MessageSquare, label: "ข้อความ", href: "/dashboard/messages" },
    { icon: Utensils, label: "เมนูสุขภาพ", href: "/dashboard/menu" },
    { icon: BookOpen, label: "แผนการกิน", href: "/dashboard/meal-plan" },
    { icon: ScrollText, label: "บันทึกอาหาร", href: "/dashboard/food-diary" },
    { icon: BarChart2, label: "ความคืบหน้า", href: "/dashboard/progress" },
    { icon: UserCog, label: "ตั้งค่า", href: "/dashboard/setting" },
  ];

  const handleLogout = async () => {
    try {
      Swal.fire({
        title: "กำลังออกจากระบบ...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col p-6 z-20 shadow-sm">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-[#C6E065] rounded-lg flex items-center justify-center">
          <span className="text-lg">🍽️</span>
        </div>
        {}
        <span className="font-black text-[#3d3522] text-xl tracking-wide">
          NutriGo
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-[#C6E065] text-[#3d3522] font-bold shadow-md"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#3d3522]"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? "text-[#3d3522]" : "text-gray-400"}`}
              />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all mt-auto"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">ออกจากระบบ</span>
      </button>
    </aside>
  );
}
