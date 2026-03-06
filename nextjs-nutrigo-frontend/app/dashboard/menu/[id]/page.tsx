"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { menuApi, MenuItem } from "@/app/services/menu-items";
import {
    ArrowLeft,
    Flame,
    Scale,
    ShoppingCart,
    Plus,
    Minus,
    Loader2,
    Utensils,
    Info,
    MapPin,
    CheckCircle2,
    Salad,
    Zap,
    Citrus
} from "lucide-react";
import Swal from "sweetalert2";

export default function MenuDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [item, setItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            const fetchItem = async () => {
                try {
                    const res = await menuApi.getMenuItemById(Number(id));
                    setItem(res.data || res);
                } catch (err) {
                    console.error("Failed to fetch menu item:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchItem();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!item) return;
        Swal.fire({
            title: "เพิ่มลงตะกร้าแล้ว!",
            text: `เพิ่ม ${item.name} จำนวน ${quantity} ชุด ลงในตะกร้าของคุณ`,
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-[#C6E065] animate-spin mb-4" />
                <p className="text-[#8a7550] font-bold">กำลังโหลดข้อมูลเมนูสุขภาพ...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black text-[#3d3522] mb-4">ไม่พบข้อมูลเมนู</h2>
                <button onClick={() => router.back()} className="text-[#4A6707] font-bold hover:underline">
                    กลับไปหน้าเมนู
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#8a7550] hover:text-[#3d3522] font-bold transition-colors group"
            >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#f0e6cc] group-hover:bg-[#C6E065] group-hover:border-[#C6E065] transition-all">
                    <ArrowLeft className="w-5 h-5 group-hover:text-[#3d3522]" />
                </div>
                <span>กลับไปหน้าเมนู</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <div className="aspect-square bg-[#faf8f2] rounded-[48px] border-4 border-white shadow-2xl shadow-[#3d3522]/5 overflow-hidden flex items-center justify-center relative">
                        {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-12 opacity-20">
                                <Utensils className="w-24 h-24 mx-auto mb-4" />
                                <p className="font-bold">No Image Available</p>
                            </div>
                        )}

                        {item.category && (
                            <div className="absolute top-8 left-8 bg-[#C6E065] text-[#3d3522] px-6 py-2 rounded-2xl font-black text-sm shadow-xl">
                                {item.category}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-[32px] border border-[#f0e6cc] text-center shadow-sm">
                            <div className="w-10 h-10 bg-[#C6E065]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Zap className="w-5 h-5 text-[#4A6707]" />
                            </div>
                            <p className="text-[10px] font-black text-[#8a7550] uppercase mb-1">Protein</p>
                            <p className="text-lg font-black text-[#3d3522]">{item.proteinG || 0}g</p>
                        </div>
                        <div className="bg-white p-5 rounded-[32px] border border-[#f0e6cc] text-center shadow-sm">
                            <div className="w-10 h-10 bg-[#C6E065]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Salad className="w-5 h-5 text-[#4A6707]" />
                            </div>
                            <p className="text-[10px] font-black text-[#8a7550] uppercase mb-1">Carbs</p>
                            <p className="text-lg font-black text-[#3d3522]">{item.carbsG || 0}g</p>
                        </div>
                        <div className="bg-white p-5 rounded-[32px] border border-[#f0e6cc] text-center shadow-sm">
                            <div className="w-10 h-10 bg-[#C6E065]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Citrus className="w-5 h-5 text-[#4A6707]" />
                            </div>
                            <p className="text-[10px] font-black text-[#8a7550] uppercase mb-1">Fat</p>
                            <p className="text-lg font-black text-[#3d3522]">{item.fatG || 0}g</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 py-4">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#3d3522] text-white px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#3d3522]/10">
                                <Flame className="w-4 h-4 text-[#C6E065]" />
                                <span className="text-sm font-black">{item.caloriesKcal || 0} kcal</span>
                            </div>
                            {item.isAvailable && (
                                <div className="bg-[#C6E065]/20 text-[#4A6707] px-4 py-1.5 rounded-xl flex items-center gap-2 border border-[#C6E065]/30">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-xs font-bold">In Stock</span>
                                </div>
                            )}
                        </div>
                        <h1 className="text-5xl font-black text-[#3d3522] leading-[1.1] mb-6">
                            {item.name}
                        </h1>
                        <p className="text-lg text-[#8a7550] font-medium leading-relaxed">
                            {item.description || "สัมผัสรสชาติแห่งสุขภาพที่คัดสรรวัตถุดิบคุณภาพสูง เพื่อให้คุณได้รับสารอาหารที่ครบถ้วนและพลังงานที่พอเหมาะในทุกคำ"}
                        </p>
                    </div>

                    {item.foodPartner && (
                        <div className="bg-[#faf8f2] p-6 rounded-[32px] border border-[#f0e6cc] flex items-start gap-4 ring-8 ring-[#faf8f2]/50">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#f0e6cc] shrink-0">
                                <span className="text-2xl">🏪</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-[#8a7550] uppercase tracking-wider mb-1 text-opacity-60">จัดจำหน่ายโดย</p>
                                <h4 className="text-lg font-black text-[#3d3522]">{item.foodPartner.partnerName}</h4>
                                <p className="text-xs text-[#8a7550] mt-1 flex items-center gap-1.5 font-medium">
                                    <MapPin className="w-3 h-3" />
                                    {item.foodPartner.address || "จังหวัดกรุงเทพมหานคร"}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6 pt-4">
                        <div className="flex items-end justify-between border-b-2 border-[#f0e6cc] pb-8 border-dashed">
                            <div>
                                <p className="text-sm font-bold text-[#8a7550] mb-1">ราคาต่อชุด</p>
                                <p className="text-5xl font-black text-[#3d3522]">
                                    <span className="text-3xl mr-1">฿</span>
                                    {Number(item.price).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 bg-white p-2 rounded-[24px] border border-[#f0e6cc] shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center bg-[#faf8f2] hover:bg-[#C6E065]/20 rounded-2xl text-[#3d3522] transition-colors disabled:opacity-30"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-8 text-center text-xl font-black text-[#3d3522]">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center bg-[#faf8f2] hover:bg-[#C6E065]/20 rounded-2xl text-[#3d3522] transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#C6E065] hover:bg-[#b8d450] text-[#3d3522] font-black py-6 px-8 rounded-3xl transition-all active:scale-[0.98] shadow-2xl shadow-[#C6E065]/40 flex items-center justify-center gap-4 text-xl group"
                            >
                                <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                สั่งซื้อเมนูนี้เลย
                            </button>

                            <button className="w-20 h-20 bg-white border-2 border-[#f0e6cc] rounded-3xl flex items-center justify-center text-[#8a7550] hover:bg-[#faf8f2] hover:text-[#3d3522] transition-all group shadow-sm">
                                <Info className="w-7 h-7 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
