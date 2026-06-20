import { Trophy, Medal } from "lucide-react";
import { mockLeaderboard } from "@/mock/data";

const rankMedals = ["", "🥇", "🥈", "🥉"];

const rankStyles = [
  "",
  "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200",
  "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200",
  "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200",
];

export default function Leaderboard() {
  const sorted = [...mockLeaderboard].sort((a, b) => a.rank - b.rank);

  return (
    <div className="animate-slide-up">
      {/* 顶部标题 */}
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-6 h-6 text-amber-500" />
        <h1 className="text-2xl font-display font-bold text-gradient">学霸榜单</h1>
      </div>

      {/* 前3名特殊展示 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {sorted.slice(0, 3).map((entry) => (
          <div
            key={entry.id}
            className={`flex flex-col items-center rounded-2xl p-4 border ${
              rankStyles[entry.rank]
            } card-hover`}
          >
            <span className="text-3xl mb-2">{rankMedals[entry.rank]}</span>
            <img
              src={entry.user.avatar}
              alt={entry.user.nickname}
              className="w-12 h-12 rounded-full mb-2 ring-2 ring-white shadow-md"
            />
            <p className="text-xs font-medium text-gray-800 text-center truncate w-full">
              {entry.user.nickname}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate w-full text-center">
              {entry.user.school}
            </p>
            <p className="text-sm font-bold text-amber-600 mt-1">
              {entry.score}
            </p>
          </div>
        ))}
      </div>

      {/* 排名列表 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        {sorted.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-4 py-3.5 ${
              index < 3 ? "bg-gradient-to-r from-amber-50/50 to-transparent" : ""
            } ${
              index !== sorted.length - 1 ? "border-b border-gray-50" : ""
            } hover:bg-gray-50/50 transition-colors`}
          >
            {/* 排名 */}
            <div className="w-8 text-center">
              {index < 3 ? (
                <span className="text-lg">{rankMedals[entry.rank]}</span>
              ) : (
                <span className="text-sm font-semibold text-gray-400">
                  {entry.rank}
                </span>
              )}
            </div>

            {/* 头像 */}
            <img
              src={entry.user.avatar}
              alt={entry.user.nickname}
              className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
            />

            {/* 信息 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {entry.user.nickname}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {entry.user.school}
              </p>
            </div>

            {/* 积分 */}
            <div className="flex items-center gap-1">
              <Medal className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-bold text-amber-600">
                {entry.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}