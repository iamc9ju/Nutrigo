"use client";

import { MenuItem } from "@/app/services/menu-items";
import { Utensils, Flame, Scale, ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface MenuCardProps {
    item: MenuItem;
    onAddToCart?: (item: MenuItem, quantity: number) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        onAddToCart?.(item, quantity);
    };

    return (
        <div className="bg-white rounded-[32px] border border-[#f0e6cc] overflow-hidden group hover:shadow-xl hover:shadow-[#C6E065]/5 transition-all duration-500 flex flex-col h-full">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#faf8f2]">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#c4b390]">
                        <Utensils className="w-12 h-12 opacity-20" />
                    </div>
                )}

                {item.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#f0e6cc] shadow-sm">
                        <span className="text-[10px] font-bold text-[#4A6707] uppercase tracking-wider">
                            {item.category}
                        </span>
                    </div>
                )}

                {item.caloriesKcal && (
                    <div className="absolute top-4 right-4 bg-[#3d3522]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-sm flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-[#C6E065]" />
                        <span className="text-[10px] font-bold text-white">
                            {item.caloriesKcal} kcal
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex-1 min-w-0 mb-4">
                    <h3 className="text-lg font-black text-[#3d3522] mb-1 truncate group-hover:text-[#4A6707] transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-xs text-[#8a7550] line-clamp-2 leading-relaxed font-medium">
                        {item.description || "เมนูเพื่อสุขภาพ รสชาติกลมกล่อม มีคุณค่าทางสารอาหารครบถ้วน"}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6 py-3 border-y border-[#f0e6cc]/50">
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-[#8a7550] uppercase mb-0.5">Protein</p>
                        <p className="text-sm font-black text-[#3d3522]">{item.proteinG || "—"}g</p>
                    </div>
                    <div className="text-center border-x border-[#f0e6cc]/50">
                        <p className="text-[9px] font-bold text-[#8a7550] uppercase mb-0.5">Carbs</p>
                        <p className="text-sm font-black text-[#3d3522]">{item.carbsG || "—"}g</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-[#8a7550] uppercase mb-0.5">Fat</p>
                        <p className="text-sm font-black text-[#3d3522]">{item.fatG || "—"}g</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto gap-4">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-[#3d3522]">
                            ฿{Number(item.price).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl p-1 shrink-0">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-1.5 hover:bg-white rounded-xl transition-colors text-[#3d3522] disabled:opacity-30"
                            disabled={quantity <= 1}
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#3d3522]">
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-1.5 hover:bg-white rounded-xl transition-colors text-[#3d3522]"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full mt-4 bg-[#C6E065] hover:bg-[#b8d450] text-[#3d3522] font-bold py-3 px-4 rounded-2xl transition-all active:scale-[0.98] shadow-md shadow-[#C6E065]/20 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#C6E065]/30"
                >
                    <ShoppingCart className="w-4 h-4" />
                    ใส่ตะกร้า
                </button>
            </div>
        </div>
    );
}
