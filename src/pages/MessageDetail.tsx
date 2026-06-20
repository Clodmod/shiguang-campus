import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useMessageStore } from "@/store";
import type { Message } from "@/types";

function formatChatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (days === 1) return `昨天 ${date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
  return date.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatBubble({ message, isSelf }: { message: Message; isSelf: boolean }) {
  return (
    <div
      className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isSelf
            ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-br-md"
            : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-bl-md"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function MessageDetail() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { conversations, messages, sendMessage, markRead } = useMessageStore();
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const id = Number(conversationId);
  const conversation = conversations.find((c) => c.id === id);
  const chatMessages = messages[id] || [];

  // Mark as read on mount
  useEffect(() => {
    if (id) markRead(id);
  }, [id, markRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || !id) return;
    sendMessage(id, text);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <p className="text-gray-400">对话不存在</p>
        <button
          className="mt-3 text-sm text-cyan-500 underline"
          onClick={() => navigate("/messages")}
        >
          返回消息列表
        </button>
      </div>
    );
  }

  const { user } = conversation;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] -mx-4 -mt-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          onClick={() => navigate("/messages")}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <img
          src={user.avatar}
          alt={user.nickname}
          className="w-9 h-9 rounded-full object-cover border border-gray-100"
        />
        <div>
          <h2 className="text-sm font-semibold text-gray-800">{user.nickname}</h2>
          <p className="text-[10px] text-gray-400">{user.school}</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50/50">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            暂无消息，发送第一条消息吧～
          </div>
        ) : (
          <>
            {chatMessages.map((msg) => (
              <div key={msg.id}>
                <ChatBubble
                  message={msg}
                  isSelf={msg.sender_id === 0}
                />
              </div>
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-100 text-sm outline-none focus:border-cyan-300 focus:bg-white transition-colors placeholder:text-gray-300"
            placeholder="输入消息..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            disabled={!inputValue.trim()}
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}