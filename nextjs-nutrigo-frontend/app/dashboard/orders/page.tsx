"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Package,
    MapPin,
    Clock,
    CheckCircle2,
    Truck,
    Loader2,
    ChevronRight,
    ShoppingBag,
    ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";

interface OrderItem {
    orderItemId: number;
    name: string;
    quantity: number;
    priceAtOrder: number;
    totalPrice: number;
    imageUrl?: string;
}

interface Order {
    orderId: string;
    totalAmount: number;
    status: "PENDING" | "PREPARING" | "SHIPPING" | "COMPLETED" | "CANCELLED";
    paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
    deliveryAddress: string;
    contactPhone: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders");
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusConfig = (status: Order["status"]) => {
        const configs = {
            PENDING: { label: "รอดำเนินการ", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
            PREPARING: { label: "กำลังจัดเตรียม", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Package },
            SHIPPING: { label: "กำลังจัดส่ง", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck },
            COMPLETED: { label: "ส่งมอบสำเร็จ", color: "bg-[#C6E065]/20 text-[#4A6707] border-[#C6E065]/30", icon: CheckCircle2 },
            CANCELLED: { label: "ยกเลิกแล้ว", color: "bg-red-100 text-red-700 border-red-200", icon: Package },
        };
        return configs[status] || configs.PENDING;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-[#C6E065] animate-spin mb-4" />
                <p className="text-[#8a7550] font-bold">กำลังโหลดประวัติการสั่งซื้อ...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#3d3522] tracking-tight">ประวัติการสั่งซื้อ</h1>
                    <p className="text-[#8a7550] mt-1 font-medium flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#C6E065]" />
                        ติดตามสถานะและตรวจสอบรายการที่คุณเคยสั่ง
                    </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-[40px] p-20 border border-[#f0e6cc] text-center space-y-6">
                    <div className="w-24 h-24 bg-[#faf8f2] rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-12 h-12 text-[#c4b390] opacity-20" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#3d3522]">คุณยังไม่มีประวัติการสั่งซื้อ</h3>
                        <p className="text-[#8a7550] mt-2 max-w-xs mx-auto">ลองเลือกชิมเมนูเพื่อสุขภาพของเราได้เลยวันนี้!</p>
                    </div>
                    <Link
                        href="/dashboard/menu"
                        className="inline-block bg-[#C6E065] text-[#3d3522] font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#C6E065]/20 hover:scale-105 transition-transform"
                    >
                        ไปหน้าเมนูอาหาร
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const status = getStatusConfig(order.status);
                        return (
                            <div
                                key={order.orderId}
                                className="bg-white rounded-[32px] border border-[#f0e6cc] overflow-hidden hover:shadow-xl hover:shadow-[#3d3522]/5 transition-all group"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-[#f0e6cc] bg-[#faf8f2]/50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#f0e6cc] shadow-sm">
                                            <ShoppingBag className="w-6 h-6 text-[#3d3522]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-[#8a7550] uppercase tracking-wider mb-0.5">Order ID</p>
                                            <p className="font-black text-[#3d3522] text-sm">#{order.orderId.substring(0, 8)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`px-4 py-1.5 rounded-xl border text-xs font-black flex items-center gap-2 ${status.color}`}>
                                            <status.icon className="w-4 h-4" />
                                            {status.label}
                                        </div>
                                        <p className="text-xs font-bold text-[#8a7550]">
                                            {format(new Date(order.createdAt), "d MMM yyyy HH:mm", { locale: th })}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="space-y-3">
                                            {order.items.map((item) => (
                                                <div key={item.orderItemId} className="flex items-center justify-between py-2 border-b border-[#f0e6cc]/30 last:border-0">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-[#faf8f2] rounded-xl overflow-hidden border border-[#f0e6cc] shrink-0">
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
                                                        <div>
                                                            <p className="text-sm font-black text-[#3d3522]">{item.name}</p>
                                                            <span className="text-[10px] font-bold text-[#8a7550] bg-[#faf8f2] px-2 py-0.5 rounded-md border border-[#f0e6cc]">x{item.quantity}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-black text-[#3d3522]">฿{item.totalPrice.toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-[#f0e6cc]/50 flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-[#8a7550] mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-black text-[#8a7550] uppercase tracking-wider mb-1">จัดส่งที่</p>
                                                <p className="text-xs text-[#8a7550] font-medium leading-relaxed">{order.deliveryAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#faf8f2] rounded-2xl p-6 flex flex-col justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-[#8a7550] uppercase tracking-wider mb-1">ยอดรวมสุทธิ</p>
                                            <p className="text-3xl font-black text-[#3d3522]">
                                                <span className="text-xl mr-1">฿</span>
                                                {order.totalAmount.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] font-bold text-[#4A6707] mt-2 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3 h-3" />
                                                {order.paymentStatus === "PAID" ? "ชำระเงินเรียบร้อยแล้ว" : "รอกดชำระเงิน"}
                                            </p>
                                        </div>

                                        <button className="w-full mt-6 bg-white border border-[#f0e6cc] hover:bg-[#3d3522] hover:text-white text-[#3d3522] font-black py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 group/btn">
                                            ดูรายละเอียด / ใบเสร็จ
                                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
