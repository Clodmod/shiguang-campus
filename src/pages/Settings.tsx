import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Eye, Lock, UserX, Info, Shield, Smartphone, ToggleLeft, ToggleRight, Globe, Users, Heart } from "lucide-react";

type SettingsSection = "main" | "notifications" | "privacy" | "security" | "blacklist" | "about";

interface ToggleItem {
  label: string;
  desc: string;
  enabled: boolean;
}

export default function Settings() {
  const navigate = useNavigate();
  const [section, setSection] = useState<SettingsSection>("main");

  // 通知开关
  const [notifications, setNotifications] = useState<ToggleItem[]>([
    { label: "匹配通知", desc: "有人和你互相喜欢时通知", enabled: true },
    { label: "消息通知", desc: "收到新消息时通知", enabled: true },
    { label: "点赞评论通知", desc: "有人点赞或评论你的动态", enabled: true },
    { label: "系统通知", desc: "活动、公告等系统消息", enabled: false },
  ]);

  // 隐私设置
  const [privacyOption, setPrivacyOption] = useState<"all" | "follow" | "match">("all");

  const toggleNotification = (index: number) => {
    setNotifications(prev => prev.map((item, i) =>
      i === index ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const renderMain = () => (
    <div className="space-y-1">
      {[
        { icon: Bell, label: "消息通知", desc: "管理推送通知", section: "notifications" as const },
        { icon: Eye, label: "隐私设置", desc: "谁可以看我的动态", section: "privacy" as const },
        { icon: Lock, label: "账号安全", desc: "手机号、密码管理", section: "security" as const },
        { icon: UserX, label: "黑名单", desc: "已屏蔽的用户", section: "blacklist" as const },
        { icon: Info, label: "关于拾光", desc: "版本 1.0.0", section: "about" as const },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => setSection(item.section)}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors card-hover"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <Icon className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 px-1">管理你在拾光Campus接收的通知类型</p>
      {notifications.map((item, index) => (
        <div key={item.label} className="flex items-center justify-between p-4 bg-white rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-700">{item.label}</p>
            <p className="text-xs text-gray-400">{item.desc}</p>
          </div>
          <button onClick={() => toggleNotification(index)} className="transition-colors">
            {item.enabled
              ? <ToggleRight className="w-8 h-8 text-cyan-500" />
              : <ToggleLeft className="w-8 h-8 text-gray-300" />}
          </button>
        </div>
      ))}
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 px-1">选择谁可以查看你发布的动态</p>
      {[
        { value: "all" as const, icon: Globe, label: "所有人", desc: "任何访客都可以看到你的动态" },
        { value: "follow" as const, icon: Users, label: "仅关注的人", desc: "只有关注你的用户可以查看" },
        { value: "match" as const, icon: Heart, label: "仅匹配的人", desc: "只有互相喜欢的用户可以查看" },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            onClick={() => setPrivacyOption(item.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
              privacyOption === item.value
                ? "bg-cyan-50 border-cyan-200"
                : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              privacyOption === item.value ? "bg-cyan-100" : "bg-gray-50"
            }`}>
              <Icon className={`w-5 h-5 ${privacyOption === item.value ? "text-cyan-600" : "text-gray-500"}`} />
            </div>
            <div className="flex-1 text-left">
              <p className={`text-sm font-medium ${privacyOption === item.value ? "text-cyan-700" : "text-gray-700"}`}>
                {item.label}
              </p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
            {privacyOption === item.value && (
              <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
          <Shield className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">学信网认证</p>
          <p className="text-xs text-green-600">已认证 · 北京大学</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">绑定手机号</p>
          <p className="text-xs text-gray-400">188****8888 · 已绑定</p>
        </div>
      </div>
    </div>
  );

  const renderBlacklist = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
        <UserX className="w-7 h-7 text-gray-300" />
      </div>
      <p className="text-gray-500 text-sm mb-1">黑名单为空</p>
      <p className="text-xs text-gray-400">屏蔽的用户将显示在这里</p>
    </div>
  );

  const renderAbout = () => (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-cyan-200 mb-4">
        <span className="text-white font-display text-xl">拾</span>
      </div>
      <h2 className="text-lg font-display text-gradient mb-1">拾光Campus</h2>
      <p className="text-xs text-gray-400 mb-6">版本 1.0.0</p>
      <div className="w-full space-y-3">
        <div className="p-4 bg-white rounded-xl text-left">
          <p className="text-sm text-gray-700 font-medium mb-1">产品定位</p>
          <p className="text-xs text-gray-500 leading-relaxed">专为在校大学生打造的学习成长型社交平台。不仅是恋爱交友，更是寻找学术搭子、竞赛队友、饭友的聚集地。</p>
        </div>
        <div className="p-4 bg-white rounded-xl text-left">
          <p className="text-sm text-gray-700 font-medium mb-1">Slogan</p>
          <p className="text-xs text-gray-500">遇见同频的你，在图书馆或晚霞里。</p>
        </div>
      </div>
    </div>
  );

  const sectionTitle: Record<SettingsSection, string> = {
    main: "设置",
    notifications: "消息通知",
    privacy: "隐私设置",
    security: "账号安全",
    blacklist: "黑名单",
    about: "关于拾光",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <button
            onClick={() => section === "main" ? navigate(-1) : setSection("main")}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="flex-1 text-center font-bold text-gray-800">{sectionTitle[section]}</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 pb-12">
        {section === "main" && renderMain()}
        {section === "notifications" && renderNotifications()}
        {section === "privacy" && renderPrivacy()}
        {section === "security" && renderSecurity()}
        {section === "blacklist" && renderBlacklist()}
        {section === "about" && renderAbout()}
      </div>
    </div>
  );
}