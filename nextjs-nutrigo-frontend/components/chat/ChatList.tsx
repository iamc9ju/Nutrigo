'use client';

import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { chatApi } from '@/services/chat.service';
import { ChatRoom } from '@/types/chat';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Search, SlidersHorizontal } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const ChatList: React.FC = () => {
    const { rooms, setRooms, activeRoomId, setActiveRoom, setLoading } = useChatStore();
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const data = await chatApi.getRooms();
                setRooms(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('ไม่สามารถโหลดรายการห้องแชทได้');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [setRooms, setLoading]);

    const filteredRooms = rooms.filter(room => {
        const name = `${room.appointment.nutritionist.firstName} ${room.appointment.nutritionist.lastName}`.toLowerCase();
        return name.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 overflow-hidden">
            {/* Search and Filter */}
            <div className="p-4 flex gap-2 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search name , chat , etc"
                        className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-orange-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
                    <SlidersHorizontal size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {error && (
                    <div className="p-4 text-sm text-red-500 text-center">{error}</div>
                )}

                {filteredRooms.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        {searchTerm ? 'ไม่พบรายการที่ค้นหา' : 'ไม่มีรายการห้องแชทในขณะนี้'}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {filteredRooms.map((room) => {
                            const isActive = activeRoomId === room.chatRoomId;
                            const lastMessage = room.messages?.[0];
                            const nutritionist = room.appointment.nutritionist;

                            return (
                                <button
                                    key={room.chatRoomId}
                                    onClick={() => setActiveRoom(room.chatRoomId)}
                                    className={cn(
                                        "w-full text-left p-4 transition-all hover:bg-gray-50 flex gap-3 items-center",
                                        isActive && "bg-orange-50/50"
                                    )}
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                            <span className="font-bold text-orange-600 text-lg">
                                                {nutritionist.firstName[0]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline gap-1">
                                            <div className="flex items-center gap-1 overflow-hidden">
                                                <span className="font-bold text-gray-900 truncate">
                                                    Dr.{nutritionist.firstName}
                                                </span>
                                                <span className="text-gray-400 text-xs shrink-0">
                                                    - Nutritionist
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-500 shrink-0 font-medium">
                                                {format(new Date(room.createdAt), 'hh:mm a')}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-500 truncate mt-0.5">
                                            {lastMessage ? lastMessage.message : 'Hey Thanapat, Just checking in to see ...'}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
