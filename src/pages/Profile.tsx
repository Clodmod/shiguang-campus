import { useNavigate } from "react-router-dom";
import { Settings, Bookmark, FileText, Shield, LogOut, ChevronRight } from "lucide-react";
import { useUserStore } from "@/store";

const menuItems = [
  { icon: FileText, label: "我的动态", color: "text-cyan-500", bg: "bg-cyan-50" },
  { icon: Bookmark, label: "我的收藏", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Shield, label: "学信网认证", color: "text-green-500", bg: "bg-green-50" },
  { icon: Settings, label: "设置", color: "text-gray-500", bg: "bg-gray-50" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, logout } = useUserStore();

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">未登录</h2>
        <p className="text-gray-500 text-sm mb-6">登录后查看个人资料</p>
        <button
          onClick={() => navigate("/login")}
          className="btn-primary px-8 py-3 text-base"
        >
          前往登录
        </button>
      </div>
    );
  }

  const gradeMap: Record<number, string> = {
    1: "大一",
    2: "大二",
    3: "大三",
    4: "大四",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* 头部背景 */}
      <div className="relative h-48 gradient-primary rounded-b-[2rem]" />

      {/* 用户信息卡片 */}
      <div className="relative px-5 -mt-24">
        <div className="flex flex-col items-center">
          {/* 头像 + 光环 */}
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full p-1 bg-white shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-cyan-300/50 ring-offset-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* 光环效果 */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-30 blur-lg animate-pulse-soft" />
          </div>

          {/* 昵称 + 认证标识 */}
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-800">{currentUser.nickname}</h1>
            {currentUser.is_verified === 1 && (
              <span className="inline-flex items-center gap-0.5 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2 py-0.5">
                <Shield className="w-3 h-3" />
                已认证
              </span>
            )}
          </div>

          {/* 学校信息 */}
          <p className="text-gray-500 text-sm mb-3">
            {currentUser.school} · {currentUser.major} · {gradeMap[currentUser.grade] || `大${currentUser.grade}`}
          </p>

          {/* MBTI + 兴趣标签 */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {currentUser.mbti && (
              <span className="tag tag-cyan font-semibold">{currentUser.mbti}</span>
            )}
            {currentUser.interests.map((interest) => (
              <span key={interest} className="tag tag-pink">{interest}</span>
            ))}
          </div>

          {/* 个人简介 */}
          {currentUser.bio && (
            <p className="text-gray-600 text-sm text-center max-w-xs mb-5 leading-relaxed">
              {currentUser.bio}
            </p>
          )}

          {/* 编辑资料按钮 */}
          <button
            onClick={() => navigate("/edit-profile")}
            className="btn-outline text-sm mb-6"
          >
            编辑资料
          </button>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="px-5 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors"
              onClick={() => {
                if (item.label === "我的动态") navigate("/");
                else if (item.label === "我的收藏") navigate("/");
                else if (item.label === "学信网认证") alert("当前账号已通过学信网认证");
                else if (item.label === "设置") navigate("/settings");
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* 退出登录 */}
      <div className="px-5 mt-8 mb-10">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 text-gray-500 text-sm hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    </div>
  );
}