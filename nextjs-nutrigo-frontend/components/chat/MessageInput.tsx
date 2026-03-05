'use client';

import React, { useState } from 'react';
import { Send, Search } from 'lucide-react';

interface MessageInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 w-full"
        >
            <div className="flex-1 bg-white rounded-2xl flex items-center px-4 py-2 shadow-sm border border-gray-100">
                <Search size={22} className="text-gray-400 mr-3" />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a Message..."
                    disabled={disabled}
                    className="flex-1 bg-transparent py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed"
                />
            </div>

            <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="flex items-center gap-2 px-6 py-3 bg-[#A3D133] hover:bg-[#92bd2e] text-white rounded-2xl font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="text-sm">Send</span>
                <Send size={18} className="rotate-0" />
            </button>
        </form>
    );
};
