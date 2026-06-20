import { motion } from "framer-motion";
import { usePostStore } from "@/store";
import PostCard from "@/components/common/PostCard";
import type { Post } from "@/types";

const tabs = [
  { key: "recommend" as const, label: "推荐" },
  { key: "following" as const, label: "关注" },
  { key: "academic" as const, label: "学术" },
];

export default function Home() {
  const { posts, activeTab, setActiveTab } = usePostStore();

  const filteredPosts = posts.filter((post: Post) => {
    if (activeTab === "recommend") return true;
    if (activeTab === "following") return false;
    if (activeTab === "academic") return post.category === "academic";
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-sky-50 to-transparent pb-2">
        <h1 className="font-display text-3xl text-center pt-4 pb-3 text-gradient">
          拾光Campus
        </h1>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? "tab-active"
                  : "tab-inactive"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === "following" ? (
          <div className="flex flex-col items-center justify-center mt-24 text-gray-400">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4"
            >
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </motion.div>
            <p className="text-base font-medium">关注的人还没有动态哦～</p>
            <p className="text-sm mt-1">去发现页看看更多精彩内容吧</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 text-gray-400">
            <p className="text-base">暂无内容</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}