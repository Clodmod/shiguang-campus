import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, Shuffle } from "lucide-react";
import { useUserStore } from "@/store";

const MBTI_OPTIONS = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

const INTEREST_OPTIONS = [
  "编程", "摄影", "跑步", "阅读", "旅行", "烘焙",
  "音乐", "绘画", "电影", "美食", "篮球", "羽毛球",
  "钢琴", "围棋", "瑜伽", "写作", "动漫", "健身",
  "户外", "唱歌", "舞蹈", "游戏", "桌游", "志愿者",
];

const GRADE_OPTIONS = [
  { value: 1, label: "大一" },
  { value: 2, label: "大二" },
  { value: 3, label: "大三" },
  { value: 4, label: "大四" },
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, updateProfile } = useUserStore();

  const [nickname, setNickname] = useState("");
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [grade, setGrade] = useState(1);
  const [mbti, setMbti] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setNickname(currentUser.nickname);
      setSchool(currentUser.school);
      setMajor(currentUser.major);
      setGrade(currentUser.grade);
      setMbti(currentUser.mbti);
      setInterests([...currentUser.interests]);
      setBio(currentUser.bio);
      setAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center p-6">
        <p className="text-gray-500 mb-4">请先登录</p>
        <button onClick={() => navigate("/login")} className="btn-primary">
          前往登录
        </button>
      </div>
    );
  }

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const generateLocalAvatar = (): string => {
  // 随机配色方案 - 明亮柔和的渐变对
  const palettes = [
    ["#00B4D8", "#0077B6"], // 蓝
    ["#FF6B6B", "#EE5A24"], // 红橙
    ["#A29BFE", "#6C5CE7"], // 紫
    ["#FD79A8", "#E84393"], // 粉
    ["#00CEC9", "#00B894"], // 青绿
    ["#FDCB6E", "#E17055"], // 橙
    ["#74B9FF", "#0984E3"], // 亮蓝
    ["#FFEAA7", "#FAB1A0"], // 暖黄
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  const bg = palette[0];
  const accent = palette[1];

  // 随机字母/符号
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const char = chars[Math.floor(Math.random() * chars.length)];

  // 随机图案类型: circle | diamond | heart | star
  const patterns = ["circle", "diamond", "heart", "star"];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  // 用 SVG 直接生成 data URI
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="${accent}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="50" fill="url(#g)"/>
    <text x="50" y="62" text-anchor="middle" fill="white" font-size="36" font-weight="700" font-family="Arial, sans-serif">${char}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

  const handleRandomAvatar = () => {
    setAvatar(generateLocalAvatar());
  };

  const handleSave = () => {
    updateProfile({
      nickname,
      school,
      major,
      grade,
      mbti,
      interests,
      bio,
      avatar,
    });
    setSaved(true);
    setTimeout(() => {
      navigate(-1);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">返回</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800">编辑资料</h1>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 transition-colors font-medium text-sm"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>

      {/* 成功提示 */}
      {saved && (
        <div className="mx-4 mt-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center animate-slide-up">
          保存成功！
        </div>
      )}

      <div className="px-4 py-5 space-y-6 max-w-lg mx-auto">
        {/* 头像设置 */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-cyan-300/50 ring-offset-2 shadow-md bg-gradient-to-br from-cyan-200 to-blue-300 flex items-center justify-center">
              <img
                src={avatar || currentUser.avatar}
                alt="头像"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".avatar-fallback")) {
                    const fallback = document.createElement("span");
                    fallback.className = "avatar-fallback text-white font-display text-2xl";
                    fallback.textContent = (currentUser?.nickname?.[0] || "?");
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-cyan-300 hover:text-cyan-600 transition-all"
            >
              <Upload className="w-4 h-4" />
              上传头像
            </button>
            <button
              onClick={handleRandomAvatar}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-cyan-300 hover:text-cyan-600 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              随机生成
            </button>
          </div>
        </div>

        {/* 昵称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all bg-white text-sm"
            placeholder="输入昵称"
          />
        </div>

        {/* 学校 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">学校</label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all bg-white text-sm"
            placeholder="输入学校"
          />
        </div>

        {/* 专业 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">专业</label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all bg-white text-sm"
            placeholder="输入专业"
          />
        </div>

        {/* 年级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">年级</label>
          <div className="flex gap-2">
            {GRADE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGrade(opt.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  grade === opt.value
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-cyan-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* MBTI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">MBTI</label>
          <div className="flex flex-wrap gap-1.5">
            {MBTI_OPTIONS.map((type) => (
              <button
                key={type}
                onClick={() => setMbti(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  mbti === type
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-cyan-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 兴趣标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            兴趣标签
            {interests.length > 0 && (
              <span className="text-gray-400 font-normal ml-1">（已选 {interests.length} 个）</span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  interests.includes(interest)
                    ? "bg-pink-100 text-pink-700 border border-pink-200"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-pink-300"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* 个人简介 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">个人简介</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all bg-white text-sm resize-none"
            placeholder="介绍一下自己..."
          />
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          className="w-full btn-primary py-3 text-base"
        >
          保存修改
        </button>
      </div>
    </div>
  );
}