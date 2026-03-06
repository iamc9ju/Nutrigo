"use client";

import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import {
    ArrowLeft,
    MapPin,
    Phone,
    CreditCard,
    ShieldCheck,
    Truck,
    CheckCircle2,
    Loader2,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "@/lib/api";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (user?.role === "patient") {
            // In a real app, we might fetch the patient's saved profile address
        }
    }, [user]);

    if (!isMounted) return null;

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-[#faf8f2] rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-[#c4b390] opacity-30" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-[#3d3522]">ตะกร้าของคุณยังว่างอยู่</h2>
                    <p className="text-[#8a7550] mt-2">กรุณาเลือกเมนูอาหารก่อนดำเนินการชำระเงิน</p>
                </div>
                <Link
                    href="/dashboard/menu"
                    className="bg-[#C6E065] text-[#3d3522] font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#C6E065]/20 hover:scale-105 transition-transform"
                >
                    กลับไปที่หน้าเมนู
                </Link>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        if (!address || !phone) {
            Swal.fire({
                title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                text: "เราต้องการที่อยู่และเบอร์ติดต่อสำหรับการจัดส่ง",
                icon: "warning",
                confirmButtonColor: "#3d3522",
            });
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: items.map(item => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity
                })),
                deliveryAddress: address,
                contactPhone: phone
            };

            const res = await api.post("/orders", orderData);

            Swal.fire({
                title: "สั่งซื้อสำเร็จ!",
                text: "คำสั่งซื้อของคุณได้รับการบันทึกเรียบร้อยแล้ว",
                icon: "success",
                confirmButtonColor: "#C6E065",
                confirmButtonText: "ไปที่ประวัติการสั่งซื้อ",
            }).then(() => {
                clearCart();
                router.push("/dashboard/orders");
            });
        } catch (err: any) {
            console.error("Order failed:", err);
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: err.response?.data?.message || "ไม่สามารถดำเนินการสั่งซื้อได้ในขณะนี้",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/menu"
                    className="flex items-center gap-2 text-[#8a7550] hover:text-[#3d3522] font-bold group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    กลับไปเลือกอาหาร
                </Link>
                <h1 className="text-3xl font-black text-[#3d3522]">ชำระเงิน</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Forms */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping Info */}
                    <section className="bg-white rounded-[40px] p-8 border border-[#f0e6cc] shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#C6E065]/10 rounded-2xl flex items-center justify-center">
                                <Truck className="w-6 h-6 text-[#4A6707]" />
                            </div>
                            <h2 className="text-xl font-black text-[#3d3522]">ข้อมูลการจัดส่ง</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-[#3d3522] flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#8a7550]" />
                                    ที่อยู่จัดส่ง
                                </label>
                                <textarea
                                    placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-4 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm focus:ring-2 focus:ring-[#C6E065]/20 focus:border-[#C6E065] outline-none transition-all h-32 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-[#3d3522] flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#8a7550]" />
                                    เบอร์โทรศัพท์ติดต่อ
                                </label>
                                <input
                                    type="text"
                                    placeholder="0xx-xxx-xxxx"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-4 bg-[#faf8f2] border border-[#f0e6cc] rounded-2xl text-sm focus:ring-2 focus:ring-[#C6E065]/20 focus:border-[#C6E065] outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section className="bg-white rounded-[40px] p-8 border border-[#f0e6cc] shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#C6E065]/10 rounded-2xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-[#4A6707]" />
                            </div>
                            <h2 className="text-xl font-black text-[#3d3522]">วิธีชำระเงิน</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-6 bg-[#faf8f2] border-2 border-[#C6E065] rounded-[32px] flex items-center gap-4 relative overflow-hidden">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-[#f0e6cc]">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <div>
                                    <p className="font-black text-[#3d3522]">Thai QR Payment</p>
                                    <p className="text-xs text-[#8a7550] font-bold">พร้อมเพย์ / ทุกธนาคาร</p>
                                </div>
                                <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-[#4A6707]" />
                            </div>

                            <div className="p-6 bg-white border-2 border-[#f0e6cc] rounded-[32px] flex items-center gap-4 opacity-50 cursor-not-allowed grayscale">
                                <div className="w-12 h-12 bg-[#faf8f2] rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">💳</span>
                                </div>
                                <div>
                                    <p className="font-black text-[#3d3522]">Credit Card</p>
                                    <p className="text-xs text-[#8a7550] font-bold">ยังไม่เปิดให้บริการ</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right: Summary */}
                <div className="space-y-6">
                    <section className="bg-[#3d3522] text-white rounded-[40px] p-8 shadow-2xl shadow-[#3d3522]/20 sticky top-24">
                        <div className="flex items-center gap-3 mb-8">
                            <ShoppingBag className="w-6 h-6 text-[#C6E065]" />
                            <h2 className="text-xl font-black">สรุปรายการสั่งซื้อ</h2>
                        </div>

                        <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.menuItemId} className="flex justify-between gap-4 items-center">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                            <img
                                                src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";
                                                    target.onerror = null;
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-white/90 truncate">{item.name}</p>
                                            <p className="text-xs text-white/50 font-medium">x{item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-sm shrink-0 text-[#C6E065]">฿{(Number(item.price) * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-white/10 mb-8">
                            <div className="flex justify-between text-sm text-white/60">
                                <span>ราคารวม</span>
                                <span>฿{getTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-white/60">
                                <span>ค่าจัดส่ง</span>
                                <span className="text-[#C6E065]">ฟรี</span>
                            </div>
                            <div className="flex justify-between text-xl font-black pt-2">
                                <span>ยอดชำระสุทธิ</span>
                                <span className="text-[#C6E065]">฿{getTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full bg-[#C6E065] hover:bg-[#b8d450] text-[#3d3522] font-black py-5 rounded-3xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-[#C6E065]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    ยืนยันการสั่งซื้อ
                                    <ShieldCheck className="w-5 h-5" />
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-center text-white/30 mt-4 px-4">
                            การกดปุ่มเป็นการยอมรับเงื่อนไขการใช้บริการของ NutriGo
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
