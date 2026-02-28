"use client";

import { Bell, ChevronRight, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function RightPanel() {
  const { user } = useAuthStore();

  return (
    <aside className="w-80 bg-white h-screen fixed right-0 top-0 border-l border-gray-100 p-6 overflow-y-auto hidden xl:block">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gray-400 rounded-2xl flex items-center justify-center text-white shadow-sm">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#3d3522]">
              {user?.firstName} {user?.lastName}
            </h4>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role || "Member"}
            </p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-200 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#3d3522]">January 2026</h3>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-[#3d3522]">&lt;</button>
            <button className="text-gray-400 hover:text-[#3d3522]">&gt;</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>Su</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
          <span className="p-2">19</span>
          <span className="p-2">20</span>
          <span className="p-2 bg-[#C6E065] rounded-xl text-[#3d3522] shadow-sm">
            21
          </span>
          <span className="p-2">22</span>
          <span className="p-2">23</span>
          <span className="p-2">24</span>
          <span className="p-2">25</span>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-[#3d3522] mb-4">Today's Meals</h3>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-2xl flex gap-3 hover:bg-[#fcfdec] transition-colors group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gray-200"></div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h5 className="text-xs font-bold text-[#3d3522] group-hover:text-[#4A6707]">
                  Breakfast
                </h5>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-[10px] text-gray-500 line-clamp-1">
                Fluffy Protein Pancakes
              </p>
              <p className="text-[10px] text-orange-500 font-medium mt-1">
                🔥 380 kcal
              </p>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl flex gap-3 hover:bg-[#fcfdec] transition-colors group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gray-200"></div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h5 className="text-xs font-bold text-[#3d3522] group-hover:text-[#4A6707]">
                  Lunch
                </h5>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-[10px] text-gray-500 line-clamp-1">
                Grilled Chicken Salad
              </p>
              <p className="text-[10px] text-orange-500 font-medium mt-1">
                🔥 420 kcal
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
