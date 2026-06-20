import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import type { Post } from "@/types";
import { usePostStore } from "@/store";

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const navigate = useNavigate();
  const { toggleLike, toggleFavorite } = usePostStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 card-hover cursor-pointer"
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={post.images[0]}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {post.user && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <img src={post.user.avatar} alt="" className="w-5 h-5 rounded-full" />
            <span className="text-white text-xs font-medium truncate max-w-[80px]">
              {post.user.nickname}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`tag ${
            post.category === "academic" ? "tag-cyan" :
            post.category === "partner" ? "tag-orange" : "tag-pink"
          }`}>
            {post.category === "academic" ? "学术" : post.category === "partner" ? "找搭子" : "校园"}
          </span>
        </div>
      </div>

      <div className="p-3">
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{post.content}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.location && (
          <p className="text-[10px] text-gray-400 mt-1.5">{post.location}</p>
        )}

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-50">
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
            className={`flex items-center gap-1 text-xs transition-colors ${
              post.is_liked ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${post.is_liked ? "fill-current" : ""}`} />
            <span>{post.like_count}</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-500 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{post.comment_count}</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(post.id); }}
            className={`flex items-center gap-1 text-xs transition-colors ${
              post.is_favorited ? "text-amber-500" : "text-gray-400 hover:text-amber-500"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${post.is_favorited ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}