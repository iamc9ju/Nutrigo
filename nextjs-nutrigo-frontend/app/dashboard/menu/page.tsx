"use client";

import { useEffect, useState } from "react";
import { menuApi, MenuItem } from "@/app/services/menu-items";
import MenuCard from "@/components/dashboard/MenuCard";
import { Search, SlidersHorizontal, Utensils, Flame, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function FoodMenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [maxCalories, setMaxCalories] = useState<number | "">("");
    const [sortBy, setSortBy] = useState("name");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const res = await menuApi.getMenuItems({
                q: search || undefined,
                category: category || undefined,
                maxCalories: maxCalories ? Number(maxCalories) : undefined,
                sortBy,
                page,
                limit: 9,
            });

            const menuData = res.data || res;
            setItems(Array.isArray(menuData) ? menuData : (menuData.data || []));
            setTotalPages(menuData.meta?.totalPages || 1);
        } catch (err) {
            console.error("Failed to fetch menu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchMenu, 300);
        return () => clearTimeout(timer);
    }, [search, category, maxCalories, sortBy, page]);

    const categories = [
        { value: "", label: "ทั้งหมด" },
        { value: "Clean Food", label: "อาหารคลีน" },
        { value: "Keto", label: "คีโต" },
        { value: "Salad", label: "สลัด" },
        { value: "Vegan", label: "มังสวิรัติ" },
        { value: "High Protein", label: "โปรตีนสูง" },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#3d3522] tracking-tight">
                        เมนูสุขภาพ
                    </h1>
                    <p className="text-[#8a7550] mt-1 font-medium flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-[#C6E065]" />
                        เมนูที่คัดสรรมาเพื่อคุณโดยเฉพาะ
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-[#C6E065]/10 px-4 py-2 rounded-2xl border border-[#C6E065]/20">
                        <p className="text-[10px] font-black text-[#4A6707] uppercase">Total Items</p>
                        <p className="text-lg font-black text-[#3d3522]">{items.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 border border-[#f0e6cc] shadow-sm space-y-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7550]" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อเมนู..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-11 pr-4 py-3 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm focus:outline-none focus:border-[#C6E065] focus:ring-2 focus:ring-[#C6E065]/20 transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-4">
                        <div className="relative min-w-[150px]">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7550]" />
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setPage(1);
                                }}
                                className="appearance-none w-full pl-11 pr-10 py-3 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm text-[#3d3522] font-bold focus:outline-none focus:border-[#C6E065] transition-all cursor-pointer"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="relative min-w-[150px]">
                            <Flame className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C6E065]" />
                            <input
                                type="number"
                                placeholder="แคลอรีสูงสุด"
                                value={maxCalories}
                                onChange={(e) => {
                                    setMaxCalories(e.target.value === "" ? "" : Number(e.target.value));
                                    setPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm focus:outline-none focus:border-[#C6E065] transition-all"
                            />
                        </div>

                        <div className="relative min-w-[150px]">
                            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7550]" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none w-full pl-11 pr-10 py-3 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm text-[#3d3522] font-bold focus:outline-none focus:border-[#C6E065] transition-all cursor-pointer"
                            >
                                <option value="name">เรียง: ชื่อ</option>
                                <option value="price">เรียง: ราคา</option>
                                <option value="caloriesKcal">เรียง: แคลอรี</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-[#f0e6cc]">
                    <Loader2 className="w-12 h-12 text-[#C6E065] animate-spin mb-4" />
                    <p className="text-[#8a7550] font-bold animate-pulse">กำลังปรุงอาหารอย่างพิถีพิถัน...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-[32px] p-20 border border-[#f0e6cc] text-center">
                    <div className="w-24 h-24 bg-[#faf8f2] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Utensils className="w-10 h-10 text-[#c4b390]" />
                    </div>
                    <h3 className="text-xl font-black text-[#3d3522] mb-2">ไม่พบเมนูที่คุณต้องการ</h3>
                    <p className="text-[#8a7550] max-w-xs mx-auto">ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองเพื่อสำรวจเมนูสุขภาพอื่น ๆ</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item) => (
                            <MenuCard key={item.menuItemId} item={item} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12 pb-12">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-3 bg-white border border-[#f0e6cc] rounded-2xl hover:bg-[#C6E065]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-5 h-5 text-[#3d3522]" />
                            </button>
                            <span className="text-sm font-black text-[#3d3522]">
                                หน้า {page} จาก {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-3 bg-white border border-[#f0e6cc] rounded-2xl hover:bg-[#C6E065]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-5 h-5 text-[#3d3522]" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
