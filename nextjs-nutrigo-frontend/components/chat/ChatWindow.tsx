'use client';

import React, { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useSocket } from '@/providers/SocketProvider';
import { chatApi } from '@/services/chat.service';
import { MessageInput } from './MessageInput';
import { format, isSameDay } from 'date-fns';
import { MessageType } from '@/types/chat';
import { Loader2, Phone, Layout, CheckCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export const ChatWindow: React.FC = () => {
    const { activeRoomId, messages, addMessage, setMessages, rooms } = useChatStore();
    const { socket, isConnected } = useSocket();
    const scrollRef = useRef<HTMLDivElement>(null);
    const userId = useAuthStore.getState().user?.userId;

    const currentRoom = rooms.find(r => r.chatRoomId === activeRoomId);
    const currentMessages = activeRoomId ? messages[activeRoomId] || [] : [];

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentMessages]);

    // Load message history
    useEffect(() => {
        if (activeRoomId) {
            const fetchMessages = async () => {
                try {
                    const data = await chatApi.getMessages(activeRoomId);
                    setMessages(activeRoomId, data);
                } catch (err) {
                    console.error('Failed to fetch messages:', err);
                }
            };

            fetchMessages();

            // Join socket room
            if (socket && isConnected) {
                socket.emit('join_room', { chatRoomId: activeRoomId }, (res) => {
                    console.log(`Joined room: ${res?.roomId}`);
                });
            }
        }
    }, [activeRoomId, socket, isConnected, setMessages]);

    const handleSendMessage = (content: string) => {
        if (socket && activeRoomId) {
            socket.emit('send_message', {
                chatRoomId: activeRoomId,
                content,
                type: MessageType.TEXT
            }, (newMessage) => {
                addMessage(activeRoomId, newMessage);
            });
        }
    };

    if (!activeRoomId) {
        return (
            <div className="h-full flex items-center justify-center bg-orange-50/30">
                <div className="text-center">
                    <p className="text-gray-400">เลือกห้องแชทเพื่อเริ่มสนทนา</p>
                </div>
            </div>
        );
    }

    const nutritionist = currentRoom?.appointment.nutritionist;

    return (
        <div className="flex flex-col h-full bg-[#FEF3C7]/40 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-white/60 backdrop-blur-md flex items-center justify-between border-b border-orange-100/50 mx-4 mt-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 border border-white">
                        {nutritionist?.firstName[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">
                            Dr.{nutritionist?.firstName}
                        </h3>
                        <p className="text-xs text-gray-400">
                            last seen recently
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-xl transition-colors">
                        <Phone size={20} />
                    </button>
                    <button className="p-2.5 text-[#A3D133] bg-[#E8F5D3] rounded-xl transition-colors">
                        <Layout size={20} />
                    </button>
                </div>
            </div>

            {/* Message List */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
            >
                {currentMessages.map((msg, index) => {
                    const isMe = msg.senderId === userId;
                    const prevMsg = index > 0 ? currentMessages[index - 1] : null;
                    const showDate = !prevMsg || !isSameDay(new Date(msg.createdAt), new Date(prevMsg.createdAt));

                    return (
                        <React.Fragment key={msg.chatMessageId}>
                            {showDate && (
                                <div className="flex justify-center my-2">
                                    <span className="text-xs text-gray-400 font-medium">
                                        {format(new Date(msg.createdAt), 'EEEE , MMM d')}
                                    </span>
                                </div>
                            )}
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}>
                                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${isMe
                                    ? 'bg-[#F9D67A] text-gray-800'
                                    : 'bg-white text-gray-800'
                                    }`}>
                                    {msg.message}
                                </div>
                                <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <span className="text-[10px] text-gray-400 font-medium tracking-tight">
                                        {format(new Date(msg.createdAt), 'h:mm a')}
                                    </span>
                                    {isMe && <CheckCheck size={14} className="text-gray-400" />}
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-4">
                <MessageInput onSendMessage={handleSendMessage} disabled={!isConnected} />
            </div>
        </div>
    );
};
