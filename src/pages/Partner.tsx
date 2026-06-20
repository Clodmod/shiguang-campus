import { useState } from "react";
import { Plus, Search, Filter, X } from "lucide-react";
import PartnerCard from "@/components/common/PartnerCard";
import { usePartnerStore } from "@/store";
import type { PartnerRequest } from "@/types";

const activityTypes = [
  { value: "study", label: "学习", emoji: "📚", color: "bg-cyan-100 text-cyan-700" },
  { value: "sports", label: "运动", emoji: "🏃", color: "bg-green-100 text-green-700" },
  { value: "food", label: "美食", emoji: "🍜", color: "bg-orange-100 text-orange-700" },
  { value: "game", label: "游戏", emoji: "🎮", color: "bg-pink-100 text-pink-700" },
  { value: "other", label: "其他", emoji: "✨", color: "bg-purple-100 text-purple-700" },
];

export default function Partner() {
  const { requests, addRequest } = usePartnerStore();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 表单状态
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activityType, setActivityType] = useState("study");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setActivityType("study");
    setLocation("");
    setTime("");
    setMaxMembers(4);
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;

    const newRequest: PartnerRequest = {
      id: Date.now(),
      user_id: 0,
      title: title.trim(),
      description: description.trim(),
      activity_type: activityType as PartnerRequest["activity_type"],
      location: location.trim(),
      time: time.trim(),
      max_members: maxMembers,
      current_members: 1,
      status: "recruiting",
      created_at: new Date().toISOString(),
    };

    addRequest(newRequest);
    resetForm();
    setShowForm(false);
  };

  const filteredRequests = searchQuery.trim()
    ? requests.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : requests;

  return (
    <div className="animate-slide-up">
      {/* 顶部标题 */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-display font-bold text-gradient">寻找搭子</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4"
        >
          <Plus className="w-4 h-4" />
          发布需求
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索搭子需求..."
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all"
          />
        </div>
      </div>

      {/* 搭子需求列表 */}
      <div className="space-y-3">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <PartnerCard key={request.id} request={request} />
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">{searchQuery ? "没有找到匹配的需求" : "还没有搭子需求，快来发布第一个吧！"}</p>
          </div>
        )}
      </div>

      {/* 发布需求弹窗 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 animate-slide-up">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">发布搭子需求</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">标题 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例：周末一起去自习"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all"
                />
              </div>

              {/* 活动类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">活动类型</label>
                <div className="grid grid-cols-5 gap-2">
                  {activityTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setActivityType(type.value)}
                      className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-xs transition-all ${
                        activityType === type.value
                          ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                          : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      <span className="text-lg">{type.emoji}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">描述 *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述一下你想找什么样的搭子，有什么具体要求..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all resize-none"
                />
              </div>

              {/* 地点和时间 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">地点</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="例：图书馆三楼"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">时间</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="例：每天 19:00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all"
                  />
                </div>
              </div>

              {/* 最大人数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">最多人数</label>
                <div className="flex items-center gap-3">
                  {[2, 4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMaxMembers(num)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        maxMembers === num
                          ? "bg-cyan-500 text-white shadow-sm"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !description.trim()}
                className={`w-full py-3 rounded-xl text-white font-medium text-sm transition-all ${
                  title.trim() && description.trim()
                    ? "gradient-primary shadow-md shadow-cyan-200 hover:shadow-lg active:scale-[0.98]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                发布需求
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}