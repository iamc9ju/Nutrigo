"use client";

import { useState } from "react";
import {
  Bell,
  User,
  Lock,
  Settings as SettingsIcon,
  Info,
  ChevronRight,
  Monitor,
  Edit3,
  Scale,
  Ruler,
  Activity,
  Calendar,
  Droplets,
  Eye,
  EyeOff,
  Languages,
  HelpCircle,
  FileText,
  Shield,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import { usePatientProfile } from "@/hooks/usePatientProfile";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = usePatientProfile();
  const [activeTab, setActiveTab] = useState("account");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [settings, setSettings] = useState({
    waterReminder: true,
    mealReminder: true,
    newsUpdate: true,
    dndMode: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "account", label: "บัญชีผู้ใช้", icon: User },
    { id: "profile", label: "โปรไฟล์", icon: Monitor },
    { id: "password", label: "รหัสผ่าน", icon: Lock },
    { id: "notifications", label: "การแจ้งเตือน", icon: Bell },
    { id: "general", label: "ทั่วไป", icon: SettingsIcon },
    { id: "about", label: "เกี่ยวกับ", icon: Info },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#3d3522]">การตั้งค่า</h1>
        <p className="text-[#8a7550] mt-1">
          จัดการข้อมูลส่วนตัวและการแจ้งเตือนของคุณ
        </p>
      </div>

      { }
      <div className="bg-[#f9f8f6] p-1.5 rounded-[20px] flex justify-between items-center mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-center transition-all duration-300
                            ${activeTab === tab.id
                ? "bg-white text-[#3d3522] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                : "text-[#8a7550] hover:text-[#3d3522] hover:bg-black/5"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border-2 border-[#f0e6cc] min-h-[500px]">
        {activeTab === "notifications" ? (
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-black text-[#3d3522] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C6E065] flex items-center justify-center text-[#3d3522]">
                  <Bell className="w-5 h-5" />
                </div>
                การแจ้งเตือน
              </h2>

              <div className="space-y-6 divide-y-2 divide-[#f0e6cc]">
                <div className="flex items-center justify-between pt-4 first:pt-0">
                  <div>
                    <h3 className="font-bold text-[#3d3522]">
                      เตือนการดื่มน้ำ
                    </h3>
                    <p className="text-xs text-gray-400">
                      แจ้งเตือนให้ดื่มน้ำทุกๆ 1-2 ชั่วโมง
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.waterReminder}
                    onChange={() => toggleSetting("waterReminder")}
                  />
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div>
                    <h3 className="font-bold text-[#3d3522]">เตือนเวลาอาหาร</h3>
                    <p className="text-xs text-gray-400">
                      แจ้งเตือนเมื่อใกล้ถึงมื้ออาหาร
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.mealReminder}
                    onChange={() => toggleSetting("mealReminder")}
                  />
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div>
                    <h3 className="font-bold text-[#3d3522]">
                      ข่าวสารและอัปเดต
                    </h3>
                    <p className="text-xs text-gray-400">
                      รับข่าวสารเกี่ยวกับสุขภาพและฟีเจอร์ใหม่ๆ
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.newsUpdate}
                    onChange={() => toggleSetting("newsUpdate")}
                  />
                </div>
              </div>
            </div>

            <div className="h-0.5 bg-[#f0e6cc]" />

            <div>
              <h2 className="text-xl font-black text-[#3d3522] mb-6">
                การตั้งค่าเพิ่มเติม
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#3d3522]">เสียงแจ้งเตือน</h3>
                  <select className="bg-[#faf8f2] border-2 border-[#f0e6cc] text-[#3d3522] text-sm rounded-xl focus:ring-[#C6E065] focus:border-[#C6E065] block p-2.5 outline-none font-medium min-w-[180px]">
                    <option>Notification Sound</option>
                    <option>Silent</option>
                    <option>Vibrate Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#3d3522]">
                    ช่วงเวลาห้ามรบกวน
                  </h3>
                  <div className="flex items-center gap-3">
                    <select
                      className="bg-[#faf8f2] border-2 border-[#f0e6cc] text-[#3d3522] text-sm rounded-xl focus:ring-[#C6E065] focus:border-[#C6E065] block p-2.5 outline-none font-medium min-w-[180px]"
                      disabled={!settings.dndMode}
                    >
                      <option>22:00 - 07:00</option>
                      <option>23:00 - 08:00</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#3d3522] opacity-80">
                      เปิดใช้งานโหมดห้ามรบกวน
                    </h3>
                    <p className="text-xs text-gray-400">
                      ปิดเสียงแจ้งเตือนในช่วงเวลาที่กำหนด
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.dndMode}
                    onChange={() => toggleSetting("dndMode")}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "account" ? (
          <div className="space-y-8">
            { }
            <div className="flex items-center gap-6 pb-8 border-b-2 border-[#f0e6cc]">
              <div className="relative">
                <div className="w-24 h-24 bg-[#faf8f2] rounded-full border-4 border-[#C6E065] flex items-center justify-center shadow-sm overflow-hidden">
                  <User className="w-10 h-10 text-[#8a7550]" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#3d3522] rounded-full flex items-center justify-center text-white border-2 border-white hover:bg-[#2c2518] transition-colors shadow-sm">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#3d3522]">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-[#8a7550] font-medium">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-[#f0e6cc] text-[#3d3522] text-xs font-bold rounded-lg uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3d3522]">
                  ชื่อจริง
                </label>
                <div className="px-4 py-3 bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-xl text-[#8a7550] font-medium">
                  {user?.firstName || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3d3522]">
                  นามสกุล
                </label>
                <div className="px-4 py-3 bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-xl text-[#8a7550] font-medium">
                  {user?.lastName || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3d3522]">
                  อีเมล
                </label>
                <div className="px-4 py-3 bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-xl text-[#8a7550] font-medium">
                  {user?.email || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3d3522]">
                  เบอร์โทรศัพท์
                </label>
                <div className="px-4 py-3 bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-xl text-[#8a7550] font-medium">
                  {profile?.phoneNumber || "-"}
                </div>
              </div>
            </div>

            { }
            <div className="bg-[#C6E065]/20 border-2 border-[#C6E065] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#C6E065] rounded-full flex items-center justify-center flex-shrink-0 text-[#3d3522]">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3d3522] text-lg">
                    ข้อมูลสุขภาพของคุณ
                  </h3>
                  <p className="text-sm text-[#8a7550]">
                    อัปเดตข้อมูลน้ำหนัก ส่วนสูง
                    และเป้าหมายเพื่อการวิเคราะห์ที่แม่นยำ
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/complete-profile"
                className="px-6 py-3 bg-[#3d3522] text-white font-bold rounded-xl hover:bg-[#2c2518] transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                อัปเดตข้อมูลสุขภาพ
              </Link>
            </div>
          </div>
        ) : activeTab === "profile" ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#3d3522]">
                ข้อมูลสุขภาพของคุณ
              </h2>
              <Link
                href="/dashboard/complete-profile"
                className="text-sm font-bold text-[#C6E065] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-4 h-4" /> แก้ไขข้อมูล
              </Link>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              { }
              <div className="bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#C6E065] shadow-sm">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#8a7550] font-bold uppercase tracking-wider">
                    น้ำหนัก
                  </p>
                  <p className="text-xl font-black text-[#3d3522]">
                    {isLoading
                      ? "..."
                      : profile?.healthMetrics?.weightKg || "-"}{" "}
                    <span className="...">กก.</span>
                  </p>
                </div>
              </div>
              { }
              <div className="bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-400 shadow-sm">
                  <Ruler className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#8a7550] font-bold uppercase tracking-wider">
                    ส่วนสูง
                  </p>
                  <p className="text-xl font-black text-[#3d3522]">
                    {isLoading
                      ? "..."
                      : profile?.healthMetrics?.heightCm || "-"}{" "}
                    <span className="...">ซม.</span>
                  </p>
                </div>
              </div>
              { }
              <div className="bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-400 shadow-sm">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#8a7550] font-bold uppercase tracking-wider">
                    BMI
                  </p>
                  <p className="text-xl font-black text-[#3d3522]">
                    {isLoading
                      ? "..."
                      : profile?.healthMetrics?.weightKg &&
                        profile?.healthMetrics?.heightCm
                        ? (
                          profile.healthMetrics.weightKg /
                          Math.pow(profile.healthMetrics.heightCm / 100, 2)
                        ).toFixed(1)
                        : "-"}
                  </p>
                </div>
              </div>

              { }
              <div className="bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-400 shadow-sm">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-[#8a7550] font-bold uppercase tracking-wider">
                    % ไขมัน
                  </p>
                  <p className="text-xl font-black text-[#3d3522]">
                    {isLoading
                      ? "..."
                      : profile?.healthMetrics?.bodyFatPercent || "-"}{" "}
                    <span className="...">%</span>
                  </p>
                </div>
              </div>
            </div>

            { }
            <div className="space-y-4">
              <h3 className="font-bold text-[#3d3522] border-b border-[#f0e6cc] pb-2">
                ข้อมูลส่วนตัว
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-white border border-[#f0e6cc] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-[#8a7550] font-medium">เพศ</span>
                  </div>
                  <span className="font-bold text-[#3d3522]">
                    {isLoading
                      ? "..."
                      : profile?.gender === "male"
                        ? "ชาย"
                        : profile?.gender === "female"
                          ? "หญิง"
                          : profile?.gender || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white border border-[#f0e6cc] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-[#8a7550] font-medium">วันเกิด</span>
                  </div>
                  {isLoading
                    ? "..."
                    : profile?.dateOfBirth
                      ? new Date(profile.dateOfBirth).toLocaleDateString(
                        "th-TH",
                        { year: "numeric", month: "long", day: "numeric" },
                      )
                      : "-"}
                </div>
                <div className="flex items-center justify-between p-4 bg-white border border-[#f0e6cc] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-red-400" />
                    <span className="text-[#8a7550] font-medium">
                      กรุ๊ปเลือด
                    </span>
                  </div>
                  <span className="font-black text-[#3d3522] text-lg bg-red-50 px-3 py-1 rounded-lg text-red-500">
                    {isLoading ? "..." : profile?.bloodType || "-"}
                  </span>
                </div>
              </div>
            </div>

            { }
            <div className="space-y-4">
              <h3 className="font-bold text-[#3d3522] border-b border-[#f0e6cc] pb-2">
                โรคประจำตัว & ภูมิแพ้
              </h3>
              <div className="bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-6">
                {isLoading ? (
                  <div className="text-center text-gray-400">
                    กำลังโหลดข้อมูล...
                  </div>
                ) : profile?.chronicDiseases &&
                  profile.chronicDiseases.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.chronicDiseases.map(
                      (disease: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-white border border-[#f0e6cc] text-[#3d3522] rounded-full text-sm font-bold shadow-sm"
                        >
                          {disease}
                        </span>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">
                      ไม่มีข้อมูลโรคประจำตัว
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === "password" ? (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#faf8f2] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#fff]">
                <Lock className="w-10 h-10 text-[#C6E065]" />
              </div>
              <h2 className="text-2xl font-black text-[#3d3522]">
                เปลี่ยนรหัสผ่าน
              </h2>
              <p className="text-[#8a7550] mt-2">
                เพื่อความปลอดภัย กรุณาตั้งรหัสผ่านที่ยากต่อการคาดเดา
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              { }
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3d3522]">
                  รหัสผ่านปัจจุบัน
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-xl text-[#3d3522] outline-none focus:border-[#C6E065] focus:ring-2 focus:ring-[#C6E065]/20 transition-all font-medium"
                    placeholder="ระบุรหัสผ่านปัจจุบัน"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8a7550] transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-[#8a7550] hover:text-[#C6E065] transition-colors"
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
              </div>

              { }
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3d3522]">
                  รหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-xl text-[#3d3522] outline-none focus:border-[#C6E065] focus:ring-2 focus:ring-[#C6E065]/20 transition-all font-medium"
                    placeholder="ระบุรหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8a7550] transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              { }
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3d3522]">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-xl text-[#3d3522] outline-none focus:border-[#C6E065] focus:ring-2 focus:ring-[#C6E065]/20 transition-all font-medium"
                    placeholder="ระบุรหัสผ่านใหม่อีกครั้ง"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8a7550] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button className="w-full py-4 bg-[#3d3522] text-white font-bold rounded-2xl hover:bg-[#2c2518] transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 mt-8">
                <Lock className="w-5 h-5" />
                เปลี่ยนรหัสผ่าน
              </button>
            </form>
          </div>
        ) : activeTab === "general" ? (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#faf8f2] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#fff]">
                <SettingsIcon className="w-10 h-10 text-[#C6E065]" />
              </div>
              <h2 className="text-2xl font-black text-[#3d3522]">
                ตั้งค่าทั่วไป
              </h2>
              <p className="text-[#8a7550] mt-2">
                ปรับแต่งการใช้งานแอปพลิเคชันให้เหมาะกับคุณ
              </p>
            </div>

            { }
            <div className="space-y-4">
              <h3 className="font-bold text-[#3d3522] border-b border-[#f0e6cc] pb-2">
                ภาษาและภูมิภาค
              </h3>
              <div className="bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#3d3522] shadow-sm">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#3d3522]">ภาษาของแอป</p>
                    <p className="text-xs text-[#8a7550]">
                      เลือกภาษาที่คุณต้องการใช้งาน
                    </p>
                  </div>
                </div>
                <select className="bg-white border-2 border-[#f0e6cc] text-[#3d3522] text-sm rounded-xl focus:ring-[#C6E065] focus:border-[#C6E065] block p-2.5 outline-none font-medium min-w-[120px]">
                  <option value="th">ภาษาไทย</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            { }
            <div className="space-y-4">
              <h3 className="font-bold text-[#3d3522] border-b border-[#f0e6cc] pb-2">
                หน่วยวัด
              </h3>
              <div className="bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#3d3522] shadow-sm">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#3d3522]">ระบบหน่วยวัด</p>
                    <p className="text-xs text-[#8a7550]">
                      เลือกหน่วยสำหรับน้ำหนักและส่วนสูง
                    </p>
                  </div>
                </div>
                <div className="flex bg-white rounded-lg p-1 border-2 border-[#f0e6cc]">
                  <button className="px-3 py-1 bg-[#C6E065] text-[#3d3522] text-xs font-bold rounded-md shadow-sm">
                    Metric (kg/cm)
                  </button>
                  <button className="px-3 py-1 text-[#8a7550] text-xs font-medium hover:text-[#3d3522]">
                    Imperial (lb/ft)
                  </button>
                </div>
              </div>
            </div>

            { }
            <div className="space-y-4">
              <h3 className="font-bold text-[#3d3522] border-b border-[#f0e6cc] pb-2">
                เกี่ยวกับแอปพลิเคชัน
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-4 flex items-center justify-between hover:bg-white hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#3d3522] shadow-sm group-hover:scale-110 transition-transform">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[#3d3522]">ศูนย์ช่วยเหลือ</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#8a7550]" />
                </button>
                <button className="w-full bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-4 flex items-center justify-between hover:bg-white hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#3d3522] shadow-sm group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[#3d3522]">
                        ข้อกำหนดและเงื่อนไข
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#8a7550]" />
                </button>
                <button className="w-full bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-4 flex items-center justify-between hover:bg-white hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#3d3522] shadow-sm group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[#3d3522]">
                        นโยบายความเป็นส่วนตัว
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#8a7550]" />
                </button>
              </div>
            </div>

            <div className="text-center pt-8 pb-4">
              <p className="text-xs text-gray-400 font-medium">
                NutriGo Version 1.0.0 (Build 20240215)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-2xl mx-auto">
            { }
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-[#3d3522] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:rotate-3 transition-transform duration-300">
                <span className="text-4xl">🥗</span>
              </div>
              <h2 className="text-3xl font-black text-[#3d3522] mb-2 tracking-tight">
                NutriGo
              </h2>
              <p className="text-[#8a7550] font-medium">
                เพื่อนคู่คิดสุขภาพของคุณ
              </p>
              <div className="mt-4 inline-block px-4 py-1.5 bg-[#f0e6cc] rounded-full">
                <p className="text-xs font-bold text-[#3d3522] tracking-wide">
                  VERSION 1.0.0
                </p>
              </div>
            </div>

            { }
            <div className="bg-[#faf8f2] border-2 border-[#f0e6cc] rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#C6E065]/20 rounded-bl-full -mr-4 -mt-4" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#3d3522]/5 rounded-tr-full -ml-4 -mb-4" />

              <h3 className="font-bold text-[#3d3522] mb-3 relative z-10">
                ภารกิจของเรา
              </h3>
              <p className="text-[#8a7550] leading-relaxed relative z-10">
                &quot;เรามุ่งมั่นที่จะช่วยให้ทุกคนมีสุขภาพที่ดีขึ้น
                ผ่านการแนะนำโภชนาการที่เข้าใจง่าย
                และสามารถนำไปปรับใช้ได้จริงในชีวิตประจำวัน
                เพื่อสร้างสังคมสุขภาพดีที่ยั่งยืน&quot;
              </p>
            </div>

            { }
            <div className="space-y-4">
              <h3 className="font-bold text-[#3d3522] border-b border-[#f0e6cc] pb-2">
                ติดต่อเรา
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 bg-white border border-[#f0e6cc] p-4 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-[#faf8f2] rounded-full flex items-center justify-center text-[#3d3522]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8a7550] font-bold">ที่อยู่</p>
                    <p className="text-sm text-[#3d3522] font-medium">
                      123 อาคารสาทรซิตี้ทาวเวอร์ เขตสาทร กรุงเทพฯ 10120
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white border border-[#f0e6cc] p-4 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-[#faf8f2] rounded-full flex items-center justify-center text-[#3d3522]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8a7550] font-bold">อีเมล</p>
                    <p className="text-sm text-[#3d3522] font-medium">
                      support@nutrigo.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white border border-[#f0e6cc] p-4 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 bg-[#faf8f2] rounded-full flex items-center justify-center text-[#3d3522]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8a7550] font-bold">โทรศัพท์</p>
                    <p className="text-sm text-[#3d3522] font-medium">
                      02-123-4567
                    </p>
                  </div>
                </div>
              </div>
            </div>

            { }
            <div className="text-center pt-4">
              <p className="text-[#8a7550] font-bold mb-4">ติดตามเรา</p>
              <div className="flex justify-center gap-4">
                <button className="w-12 h-12 bg-[#3d3522] text-white rounded-full flex items-center justify-center hover:bg-[#C6E065] hover:text-[#3d3522] transition-all transform hover:-translate-y-1 shadow-lg">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 bg-[#3d3522] text-white rounded-full flex items-center justify-center hover:bg-[#C6E065] hover:text-[#3d3522] transition-all transform hover:-translate-y-1 shadow-lg">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 bg-[#3d3522] text-white rounded-full flex items-center justify-center hover:bg-[#C6E065] hover:text-[#3d3522] transition-all transform hover:-translate-y-1 shadow-lg">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 bg-[#3d3522] text-white rounded-full flex items-center justify-center hover:bg-[#C6E065] hover:text-[#3d3522] transition-all transform hover:-translate-y-1 shadow-lg">
                  <Youtube className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-[#f0e6cc]">
              <p className="text-xs text-gray-400">
                © 2024 NutriGo Co., Ltd. All rights reserved.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#C6E065] focus:ring-offset-2
                ${enabled ? "bg-[#C6E065]" : "bg-gray-200"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition shadow-sm
                    ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}
