"use client";

import StatCard from '@/components/dashboard/StatCard';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      { }
      <div>
        <h1 className="text-3xl font-black text-[#3d3522]">
          สวัสดี, ผู้ใช้งานใหม่!
        </h1>
        <p className="text-[#8a7550] mt-1 font-medium">
          มาเริ่มดูแลสุขภาพให้ดีขึ้นตั้งแต่วันนี้กันเถอะ
        </p>
      </div>

      { }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        { }
        <StatCard
          title="น้ำหนัก"
          value="82"
          unit="กก."
          description="90   85   80   75   70"
        >
          <div className="relative h-12 mt-2 w-full">
            { }
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-300"></div>
            <div className="flex justify-between items-end h-full px-2">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`w-[1px] ${i % 2 === 0 ? "h-4 bg-gray-300" : "h-2 bg-gray-200"}`}
                ></div>
              ))}
            </div>
            { }
            <div className="absolute top-1/2 left-[40%] transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
            <div className="absolute top-1/2 left-[40%] transform -translate-x-1/2 mt-3 text-[10px] font-bold text-orange-500">
              82
            </div>
          </div>
        </StatCard>

        { }
        <StatCard
          title="ก้าวเดิน"
          value="4850"
          unit="ก้าว"
          description="65%    เหลืออีก 2,150 ก้าว"
        >
          <div className="flex gap-1 h-3 mt-4">
            <div className="h-full bg-orange-400 w-[65%] rounded-l-full"></div>
            <div className="h-full bg-orange-100 w-[35%] rounded-r-full"></div>
          </div>
        </StatCard>

        { }
        <StatCard title="การนอนหลับ" value="7.5" unit="ชั่วโมง">
          <div className="flex justify-between items-end h-16 mt-2 gap-2">
            { }
            {[40, 60, 50, 80, 70, 40].map((h, i) => (
              <div
                key={i}
                className="w-1.5 h-full bg-gray-100 rounded-full relative overflow-hidden"
              >
                <div
                  style={{ height: `${h}%` }}
                  className={`absolute bottom-0 w-full rounded-full ${i >= 3 ? "bg-[#C6E065]" : "bg-orange-300"}`}
                ></div>
              </div>
            ))}
          </div>
        </StatCard>

        { }
        <StatCard title="ดื่มน้ำ" value="0.7" unit="ลิตร (เหลือ)">
          <div className="h-16 w-full bg-yellow-50 rounded-xl mt-4 relative overflow-hidden flex items-end border border-yellow-100">
            <div className="w-full bg-[#facc15] h-[50%] opacity-80 rounded-b-xl"></div>
            <span className="absolute bottom-2 right-2 text-[10px] text-yellow-700 font-bold">
              1.3/2 ลิตร
            </span>
          </div>
        </StatCard>
      </div>

      { }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        { }
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-[#f0f0f0]">
          <div className="flex justify-between items-start mb-8">
            <h3 className="font-bold text-[#3d3522] text-lg">ปริมาณแคลอรี่</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#C6E065] rounded-xl text-[#3d3522] font-bold">
                  <span className="text-xl">Ψ4</span>
                </div>
                <div>
                  <p className="text-lg font-black text-[#3d3522]">
                    1750{" "}
                    <span className="text-sm font-normal text-gray-400">
                      kcal
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">ที่กินไปแล้ว</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#C6E065]/20 rounded-xl text-[#3d3522] font-bold">
                  <span className="text-xl">🔥</span>
                </div>
                <div>
                  <p className="text-lg font-black text-[#3d3522]">
                    510{" "}
                    <span className="text-sm font-normal text-gray-400">
                      kcal
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">ที่เผาผลาญ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            { }
            <div className="relative w-56 h-56 flex-shrink-0">
              { }
              <div className="absolute inset-2 rounded-full border-[1.5em] border-gray-50 shadow-inner"></div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  stroke="#fce7f300"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  stroke="#f59e0b"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="565"
                  strokeDashoffset="200"
                  strokeLinecap="round"
                  className="filter drop-shadow-md"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl text-gray-400 mb-1">🔥</span>
                <span className="text-4xl font-black text-[#3d3522]">1750</span>
                <span className="text-sm text-gray-400 font-medium">kcal</span>
                <span className="text-xs text-gray-400 mt-1">
                  แคลอรี่คงเหลือ
                </span>
              </div>
            </div>

            { }
            <div className="flex-1 w-full space-y-6">
              { }
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                    <span>คาร์โบไฮเดรต</span>
                    <span>37%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C6E065] w-[37%] rounded-full"></div>
                  </div>
                </div>
                <div className="ml-4 text-right min-w-[80px]">
                  <span className="text-lg font-black text-[#3d3522]">120</span>
                  <span className="text-xs text-gray-400"> / 325 กรัม</span>
                </div>
              </div>
              { }
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                    <span>โปรตีน</span>
                    <span>93%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C6E065] w-[93%] rounded-full"></div>
                  </div>
                </div>
                <div className="ml-4 text-right min-w-[80px]">
                  <span className="text-lg font-black text-[#3d3522]">70</span>
                  <span className="text-xs text-gray-400"> / 75 กรัม</span>
                </div>
              </div>
              { }
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                    <span>ไขมัน</span>
                    <span>45%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C6E065] w-[45%] rounded-full"></div>
                  </div>
                </div>
                <div className="ml-4 text-right min-w-[80px]">
                  <span className="text-lg font-black text-[#3d3522]">20</span>
                  <span className="text-xs text-gray-400"> / 44 กรัม</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        { }
        <div className="bg-white p-8 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-[#f0f0f0]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#3d3522] text-lg">เมนูแนะนำ</h3>
            <button className="text-gray-300 hover:text-gray-500">•••</button>
          </div>

          <div className="space-y-6">
            { }
            <div className="group cursor-pointer">
              <div className="aspect-[1.5] bg-gray-100 rounded-3xl mb-4 overflow-hidden relative shadow-sm">
                <span className="absolute top-4 left-4 bg-[#C6E065] text-[#3d3522] text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full z-10">
                  ของว่าง
                </span>
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#3d3522] text-[10px] font-bold px-2 py-1 rounded-lg z-10 flex items-center gap-1">
                  🔥 280 kcal
                </span>
                { }
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=2810&auto=format&fit=crop)",
                  }}
                ></div>
              </div>

              <div className="flex gap-4 text-[10px] font-bold text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C6E065]"></span>{" "}
                  คาร์บ 28 ก.
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C6E065]"></span>{" "}
                  โปรตีน 15 ก.
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-300"></span>{" "}
                  ไขมัน 8 ก.
                </span>
              </div>

              <h4 className="font-bold text-[#3d3522] text-base group-hover:text-[#4A6707] transition-colors leading-tight">
                กรีกโยเกิร์ต กราโนล่า และมิกซ์เบอร์รี่
              </h4>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                อุดมไปด้วยโพรไบโอติกและสารต้านอนุมูลอิสระ
                เป็นมื้อว่างที่เบาสบายท้อง
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
