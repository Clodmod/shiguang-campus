import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, UserPlus, MapPin } from "lucide-react";
import { mockUsers, mockPosts } from "@/mock/data";
import type { User } from "@/types";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user: User | undefined = mockUsers.find(
    (u) => u.id === Number(id)
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
        <p className="text-lg text-gray-400 font-medium">用户不存在</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-cyan-500 hover:text-cyan-600 transition-colors"
        >
          返回上一页
        </button>
      </div>
    );
  }

  const userPosts = mockPosts
    .filter((p) => p.user_id === user.id)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return (
    <div className="animate-slide-up">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">个人主页</h1>
      </div>

      {/* 用户信息卡片 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 mb-4">
        {/* 头像和昵称 */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-16 h-16 rounded-full ring-4 ring-cyan-100 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-800">{user.nickname}</h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{user.school}</span>
            </div>
          </div>
        </div>

        {/* 学校/专业 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="tag-cyan">{user.school}</span>
          <span className="tag-pink">{user.major}</span>
          {user.mbti && <span className="tag-green">{user.mbti}</span>}
        </div>

        {/* 兴趣标签 */}
        {user.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* 简介 */}
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          {user.bio}
        </p>

        {/* 操作按钮 */}
        <div className="flex items-center gap-3">
          <button className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm py-2.5">
            <UserPlus className="w-4 h-4" />
            关注
          </button>
          <button
            onClick={() => navigate("/messages")}
            className="btn-outline flex-1 flex items-center justify-center gap-1.5 text-sm py-2.5"
          >
            <MessageCircle className="w-4 h-4" />
            私聊
          </button>
        </div>
      </div>

      {/* 动态列表 */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400" />
          他的动态
        </h3>

        {userPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-50">
            <p className="text-sm text-gray-400">暂无动态</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                  {post.content}
                </p>
                {post.images.length > 0 && (
                  <img
                    src={post.images[0]}
                    alt=""
                    className="w-full h-40 object-cover rounded-xl mt-3"
                  />
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {post.like_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comment_count}
                  </span>
                  <span className="ml-auto">
                    {new Date(post.created_at).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}