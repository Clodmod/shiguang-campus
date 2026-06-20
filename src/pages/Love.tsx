import { useState } from "react";
import { Heart, HeartHandshake, Calendar, Check, Sparkles } from "lucide-react";
import { mockCP, mockCheckins } from "@/mock/data";

export default function Love() {
  const [hasCP] = useState(true);
  const [checkins, setCheckins] = useState(
    mockCheckins.filter((c) => c.cp_id === mockCP.id)
  );

  const toggleCheckin = (id: number) => {
    setCheckins((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, completed: c.completed ? 0 : 1 } : c
      )
    );
  };

  const todayCheckins = checkins.filter(
    (c) => c.checkin_date === new Date().toISOString().slice(0, 10)
  );

  return (
    <div className="animate-slide-up">
      {/* 顶部标题 */}
      <div className="flex items-center gap-2 mb-5">
        <Heart className="w-6 h-6 text-love-500 fill-love-500" />
        <h1 className="text-2xl font-display font-bold text-love-600">恋爱空间</h1>
        <Sparkles className="w-5 h-5 text-amber-400" />
      </div>

      {!hasCP ? (
        /* 未绑定CP状态 */
        <div className="flex flex-col items-center justify-center py-20">
          <HeartHandshake className="w-20 h-20 text-gray-300 mb-4" />
          <p className="text-lg text-gray-400 font-medium mb-6">
            还没有绑定CP哦～
          </p>
          <button className="btn-accent flex items-center gap-2">
            <Heart className="w-4 h-4" />
            寻找另一半
          </button>
        </div>
      ) : (
        /* 已绑定CP状态 */
        <div className="space-y-5">
          {/* CP头像并排展示 */}
          <div className="flex items-center justify-center gap-4 py-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full ring-4 ring-love-200 overflow-hidden shadow-lg">
                <img
                  src={mockCP.user1.avatar}
                  alt={mockCP.user1.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {mockCP.user1.nickname}
              </span>
            </div>

            <div className="flex flex-col items-center px-3">
              <div className="w-10 h-10 rounded-full bg-love-100 flex items-center justify-center animate-pulse-soft">
                <Heart className="w-5 h-5 text-love-500 fill-love-500" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full ring-4 ring-love-200 overflow-hidden shadow-lg">
                <img
                  src={mockCP.user2.avatar}
                  alt={mockCP.user2.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {mockCP.user2.nickname}
              </span>
            </div>
          </div>

          {/* 在一起天数 */}
          <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
            <p className="text-sm text-gray-400 mb-1">在一起</p>
            <p className="text-5xl font-display font-bold text-love-500">
              {mockCP.days_count}
            </p>
            <p className="text-sm text-gray-400 mt-1">天</p>
          </div>

          {/* 每日打卡任务 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-love-400" />
              <h2 className="font-semibold text-gray-800">今日打卡</h2>
            </div>
            <div className="space-y-3">
              {(todayCheckins.length > 0 ? todayCheckins : checkins).map(
                (checkin) => (
                  <label
                    key={checkin.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      onClick={() => toggleCheckin(checkin.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        checkin.completed
                          ? "bg-love-500 border-love-500"
                          : "border-gray-300 group-hover:border-love-300"
                      }`}
                    >
                      {checkin.completed && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        checkin.completed
                          ? "text-gray-400 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {checkin.task_name}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* 纪念日 */}
          <div className="bg-gradient-to-r from-love-50 to-pink-50 rounded-2xl p-5 border border-love-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-love-400" />
              <h2 className="font-semibold text-gray-800">纪念日</h2>
            </div>
            <p className="text-sm text-gray-500">
              绑定日期：{new Date(mockCP.bind_at).toLocaleDateString("zh-CN")}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              已相伴 {mockCP.days_count} 天
            </p>
          </div>
        </div>
      )}
    </div>
  );
}