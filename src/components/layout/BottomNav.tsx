import { NavLink } from "react-router-dom";
import { Home, Heart, MessageCircle, User, Users } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "发现" },
  { to: "/match", icon: Heart, label: "匹配" },
  { to: "/partner", icon: Users, label: "搭子" },
  { to: "/messages", icon: MessageCircle, label: "消息" },
  { to: "/profile", icon: User, label: "我的" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-100 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-colors duration-200 ${
                isActive ? "text-cyan-500" : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}