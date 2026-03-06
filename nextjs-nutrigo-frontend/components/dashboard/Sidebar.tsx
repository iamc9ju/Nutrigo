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
  Clock,
  Package,
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
    { icon: Heart, label: "บริการโภชนาการ", href: "/dashboard/nutrition", roles: ["patient", "admin"] },
    { icon: Calendar, label: "การนัดหมาย", href: "/dashboard/appointments", roles: ["patient", "nutritionist", "admin"] },
    { icon: Clock, label: "จัดการเวลาทำงาน", href: "/dashboard/nutritionists/schedule", roles: ["nutritionist", "admin"] },
    { icon: MessageSquare, label: "ข้อความ", href: "/dashboard/chat", roles: ["patient", "nutritionist", "admin"] },
    { icon: Utensils, label: "เมนูสุขภาพ", href: "/dashboard/menu", roles: ["patient", "admin"] },
    { icon: Utensils, label: "จัดการเมนู", href: "/dashboard/menu", roles: ["food_partner", "admin"] },
    { icon: Package, label: "รายการสั่งซื้อ", href: "/dashboard/orders", roles: ["patient", "food_partner", "admin"] },
    { icon: BookOpen, label: "แผนการกิน", href: "/dashboard/meal-plan", roles: ["patient", "nutritionist", "admin"] },
    { icon: ScrollText, label: "บันทึกอาหาร", href: "/dashboard/food-diary", roles: ["patient"] },
    { icon: BarChart2, label: "ความคืบหน้า", href: "/dashboard/progress", roles: ["patient", "admin"] },
    { icon: UserCog, label: "ตั้งค่า", href: "/dashboard/setting" },
  ];

  const userRole = useAuthStore((state) => state.user?.role);
  const filteredMenuItems = menuItems.filter(item => !item.roles || item.roles.includes(userRole as any));

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
      <Link href="/" className="flex items-center gap-3 mb-10 px-2 group">
        <div className="w-8 h-8 bg-[#C6E065] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-lg">🍽️</span>
        </div>
        <span className="font-black text-[#3d3522] text-xl tracking-wide">
          NutriGo
        </span>
      </Link>

      <nav className="flex-1 space-y-2">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
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

      { }
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
