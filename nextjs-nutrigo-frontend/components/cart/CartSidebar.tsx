"use client";

import { useCartStore } from "@/store/cart-store";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    const { items, removeItem, updateQuantity, getTotal, getTotalItems } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    } flex flex-col`}
            >
                {/* Header */}
                <div className="p-6 border-b border-[#f0e6cc] flex items-center justify-between bg-[#faf8f2]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#C6E065] rounded-xl flex items-center justify-center shadow-lg shadow-[#C6E065]/20">
                            <ShoppingBag className="w-5 h-5 text-[#3d3522]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#3d3522]">ตะกร้าของคุณ</h2>
                            <p className="text-xs font-bold text-[#8a7550]">{getTotalItems()} รายการ</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-xl transition-colors text-[#8a7550]"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-[#faf8f2] rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-[#c4b390] opacity-20" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#3d3522]">ตะกร้ายังว่างอยู่</h3>
                                <p className="text-sm text-[#8a7550] max-w-[200px] mx-auto">
                                    เลือกเมนูสุขภาพที่คุณสนใจลงในตะกร้าได้เลย!
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-[#4A6707] font-bold hover:underline py-2"
                            >
                                ไปเลือกเมนูอาหาร
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.menuItemId}
                                className="flex gap-4 p-4 bg-white border border-[#f0e6cc] rounded-[24px] group hover:border-[#C6E065] transition-all"
                            >
                                <div className="w-20 h-20 bg-[#faf8f2] rounded-2xl overflow-hidden shrink-0">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";
                                                target.onerror = null;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-10">
                                            <ShoppingBag />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-black text-[#3d3522] truncate text-sm">
                                            {item.name}
                                        </h4>
                                        <button
                                            onClick={() => removeItem(item.menuItemId)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-black text-[#3d3522]">
                                            ฿{(Number(item.price) * item.quantity).toLocaleString()}
                                        </span>

                                        <div className="flex items-center bg-[#faf8f2] border border-[#f0e6cc] rounded-xl p-0.5">
                                            <button
                                                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                                className="p-1 hover:bg-white rounded-lg transition-colors text-[#3d3522] disabled:opacity-30"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-6 text-center text-xs font-black text-[#3d3522]">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                                className="p-1 hover:bg-white rounded-lg transition-colors text-[#3d3522]"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 bg-[#faf8f2] border-t border-[#f0e6cc] space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-[#8a7550]">
                                <span>ราคารวม</span>
                                <span>฿{getTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-[#3d3522]">
                                <span>ยอดชำระสุทธิ</span>
                                <span>฿{getTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        <Link
                            href="/dashboard/checkout"
                            className="w-full bg-[#3d3522] hover:bg-[#2a2417] text-white font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#3d3522]/10 group"
                            onClick={onClose}
                        >
                            ไปที่หน้าชำระเงิน
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#C6E065]" />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
