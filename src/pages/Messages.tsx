import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useMessageStore } from "@/store";
import type { Conversation } from "@/types";

function formatTime(dateStr: string): string {
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
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

function ConversationItem({
  conversation,
  onClick,
}: {
  conversation: Conversation;
  onClick: () => void;
}) {
  const { user, last_message, last_message_at, unread_count } = conversation;

  return (
    <div
      className="flex items-center gap-3 px-1 py-3.5 border-b border-gray-50 active:bg-gray-50/80 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={user.avatar}
          alt={user.nickname}
          className="w-12 h-12 rounded-full object-cover border border-gray-100"
        />
        {unread_count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
            {unread_count > 99 ? "99+" : unread_count}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {user.nickname}
          </h3>
          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
            {formatTime(last_message_at)}
          </span>
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {last_message}
        </p>
      </div>
    </div>
  );
}

export default function Messages() {
  const navigate = useNavigate();
  const { conversations } = useMessageStore();

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-lg font-bold text-gray-800 mb-2">消息</h1>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <MessageCircle className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">暂无消息</p>
        </div>
      ) : (
        <div className="flex-1 -mx-4 px-4">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              onClick={() => navigate(`/messages/${conv.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}