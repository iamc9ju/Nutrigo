'use client';

import React from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
    return (
        <div className="h-[calc(100vh-160px)] flex gap-6">
            <div className="w-80 shrink-0">
                <ChatList />
            </div>
            <div className="flex-1">
                <ChatWindow />
            </div>
        </div>
    );
}
