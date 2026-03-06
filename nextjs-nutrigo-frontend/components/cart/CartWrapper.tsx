"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import CartSidebar from "./CartSidebar";

export default function CartWrapper() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const totalItems = useCartStore((state) => state.getTotalItems());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || totalItems === 0) return null;

    return (
        <>
            <button
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-[#3d3522] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
            >
                <div className="relative">
                    <ShoppingBag className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#C6E065] text-[#3d3522] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#3d3522] animate-bounce">
                        {totalItems}
                    </span>
                </div>
            </button>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
