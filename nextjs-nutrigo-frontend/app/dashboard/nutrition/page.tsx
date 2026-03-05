"use client";

import { useEffect, useState } from "react";
import NutritionistCard from "@/components/dashboard/NutritionistCard";
import type { Nutritionist } from "@/components/dashboard/NutritionistCard";
import { nutritionistApi } from "@/app/services/nutritionists";
import { Search, SlidersHorizontal, Star } from "lucide-react";

export default function NutritionistListPage() {
    const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [maxFee, setMaxFee] = useState<number | "">("");
    const [minRating, setMinRating] = useState<number | "">("");

    useEffect(() => {
        const fetchNutritionists = async () => {
            try {
                const res = await nutritionistApi.getNutritionists({
                    search: search || undefined,
                    sortBy: sortBy !== "newest" ? sortBy : undefined,
                    maxFee: maxFee !== "" ? Number(maxFee) : undefined,
                    minRating: minRating !== "" ? Number(minRating) : undefined,
                });
                setNutritionists(res.data ?? res);
            } catch (err) {
                console.error("Failed to fetch nutritionists:", err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchNutritionists, 300);
        return () => clearTimeout(debounce);
    }, [search, sortBy, maxFee, minRating]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-[#3d3522]">
                    บริการโภชนาการ
                </h1>
                <p className="text-[#8a7550] mt-1 font-medium">
                    เลือกนักโภชนาการที่เหมาะกับคุณ แล้วนัดปรึกษาได้เลย
                </p>
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white rounded-[32px] p-6 border border-[#f0e6cc] shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7550]" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อนักโภชนาการ..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setLoading(true);
                            }}
                            className="w-full pl-11 pr-4 py-3 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm focus:outline-none focus:border-[#C6E065] focus:ring-2 focus:ring-[#C6E065]/20 transition-all placeholder:text-[#c4b390]"
                        />
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-4">
                        {/* Max Fee Filter */}
                        <div className="relative min-w-[140px]">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8a7550] font-bold">฿</span>
                            <input
                                type="number"
                                placeholder="งบสูงสุด"
                                value={maxFee}
                                onChange={(e) => {
                                    const val = e.target.value === "" ? "" : Number(e.target.value);
                                    setMaxFee(val);
                                    setLoading(true);
                                }}
                                className="w-full pl-8 pr-4 py-3 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm focus:outline-none focus:border-[#C6E065] focus:ring-2 focus:ring-[#C6E065]/20 transition-all placeholder:text-[#c4b390]"
                            />
                        </div>

                        {/* Min Rating Filter */}
                        <div className="relative min-w-[140px]">
                            <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <select
                                value={minRating}
                                onChange={(e) => {
                                    const val = e.target.value === "" ? "" : Number(e.target.value);
                                    setMinRating(val);
                                    setLoading(true);
                                }}
                                className="appearance-none w-full pl-10 pr-4 py-3 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm text-[#3d3522] font-medium focus:outline-none focus:border-[#C6E065] focus:ring-2 focus:ring-[#C6E065]/20 transition-all cursor-pointer"
                            >
                                <option value="">คะแนนทั้งหมด</option>
                                <option value="4">4 ดาวขึ้นไป</option>
                                <option value="3">3 ดาวขึ้นไป</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="relative min-w-[160px]">
                            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7550]" />
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setLoading(true);
                                }}
                                className="appearance-none w-full pl-11 pr-10 py-3 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm text-[#3d3522] font-medium focus:outline-none focus:border-[#C6E065] focus:ring-2 focus:ring-[#C6E065]/20 transition-all cursor-pointer"
                            >
                                <option value="newest">เรียง: ล่าสุด</option>
                                <option value="lowest_fee">เรียง: ค่าปรึกษาต่ำสุด</option>
                                <option value="highest_rated">เรียง: คะแนนสูงสุด</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl border-2 border-[#f0e6cc] overflow-hidden animate-pulse"
                        >
                            <div className="aspect-[4/3] bg-gray-100" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-gray-100 rounded-full w-2/3" />
                                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                                <div className="flex gap-2 mt-2">
                                    <div className="h-6 bg-gray-100 rounded-full w-16" />
                                    <div className="h-6 bg-gray-100 rounded-full w-16" />
                                </div>
                                <div className="h-px bg-[#f0e6cc] mt-3" />
                                <div className="flex justify-between items-center pt-2">
                                    <div className="h-3 bg-gray-100 rounded-full w-12" />
                                    <div className="h-4 bg-gray-100 rounded-full w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : nutritionists.length === 0 ? (
                <div className="bg-white rounded-[32px] p-12 border border-[#f0e6cc] text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-lg font-bold text-[#3d3522] mb-2">
                        ไม่พบนักโภชนาการ
                    </p>
                    <p className="text-sm text-[#8a7550]">
                        ลองเปลี่ยนคำค้นหาหรือตัวกรอง
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nutritionists.map((nutritionist) => (
                        <NutritionistCard
                            key={nutritionist.nutritionistId}
                            nutritionist={nutritionist}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
