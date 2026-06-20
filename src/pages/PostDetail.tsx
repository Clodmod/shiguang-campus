import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, MessageCircle, Bookmark, Send, MapPin } from "lucide-react";
import { usePostStore } from "@/store";
import { mockComments, mockUsers } from "@/mock/data";
import type { Comment } from "@/types";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, toggleLike, toggleFavorite, addComment } = usePostStore();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const post = posts.find((p) => p.id === Number(id));

  useEffect(() => {
    const postId = Number(id);
    setComments(mockComments.filter((c) => c.post_id === postId));
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white text-gray-400">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base"
        >
          动态不存在
        </motion.p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-cyan-500 hover:text-cyan-600 transition-colors"
        >
          返回上一页
        </button>
      </div>
    );
  }

  const handleSendComment = () => {
    const text = newComment.trim();
    if (!text) return;

    const newCommentObj: Comment = {
      id: Date.now(),
      post_id: post.id,
      user_id: 0,
      content: text,
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newCommentObj]);
    addComment(post.id);
    setNewComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}月${day}日 ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="flex items-center px-4 h-12">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="ml-2 text-sm font-medium text-gray-700">动态详情</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image */}
          <div className="w-full aspect-square bg-gray-100">
            <img
              src={post.images[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <img
              src={post.user?.avatar}
              alt=""
              className="w-10 h-10 rounded-full bg-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{post.user?.nickname}</p>
              <p className="text-xs text-gray-400">{formatTime(post.created_at)}</p>
            </div>
            <div className={`tag ${
              post.category === "academic" ? "tag-cyan" :
              post.category === "partner" ? "tag-orange" : "tag-pink"
            }`}>
              {post.category === "academic" ? "学术" : post.category === "partner" ? "找搭子" : "校园"}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pt-1">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Tags & Location */}
          <div className="px-4 pt-3 space-y-1.5">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {post.location && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{post.location}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 py-4 flex items-center gap-6 border-b border-gray-100">
            <button
              onClick={() => toggleLike(post.id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                post.is_liked ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
              }`}
            >
              <Heart className={`w-5 h-5 ${post.is_liked ? "fill-current" : ""}`} />
              <span>{post.like_count}</span>
            </button>
            <button
              onClick={() => inputRef.current?.focus()}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.comment_count}</span>
            </button>
            <button
              onClick={() => toggleFavorite(post.id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                post.is_favorited ? "text-amber-500" : "text-gray-400 hover:text-amber-500"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${post.is_favorited ? "fill-current" : ""}`} />
              <span>{post.is_favorited ? "已收藏" : "收藏"}</span>
            </button>
          </div>

          {/* Comments */}
          <div className="px-4 pt-4 pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              评论 <span className="text-gray-400 font-normal">({comments.length})</span>
            </h3>
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">暂无评论，来说点什么吧～</p>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {comments.map((comment) => {
                    const user = mockUsers.find((u) => u.id === comment.user_id);
                    return (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <img
                          src={user?.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium text-gray-700">
                              {user?.nickname ?? "未知用户"}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {formatTime(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
        <div ref={bottomRef} />
      </div>

      {/* Comment Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="说点什么..."
            className="flex-1 h-10 px-4 text-sm bg-gray-50 rounded-full border border-gray-100 
                       focus:outline-none focus:border-cyan-300 focus:bg-white transition-all
                       placeholder:text-gray-400"
          />
          <button
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              newComment.trim()
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-200 hover:bg-cyan-600"
                : "bg-gray-100 text-gray-300"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}