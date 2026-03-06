'use client';

import React from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
    return (
        <div className="h-[calc(100vh-80px)] flex gap-0 bg-white rounded-3xl overflow-hidden shadow-xl border border-orange-100/50">
            <div className="w-96 shrink-0 border-r border-orange-100/50">
                <ChatList />
            </div>
            <div className="flex-1 h-full">
                <ChatWindow />
            </div>
        </div>
    );
}
