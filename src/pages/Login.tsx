import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, Shield, Sparkles } from "lucide-react";
import { getWechatAuthUrl } from "@/utils/wechatOAuth";
import { useUserStore } from "@/store";
import Logo from "@/components/common/Logo";

// 微信图标 SVG
function WechatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 11C9.328 11 10 10.328 10 9.5C10 8.672 9.328 8 8.5 8C7.672 8 7 8.672 7 9.5C7 10.328 7.672 11 8.5 11Z" fill="currentColor"/>
      <path d="M15.5 11C16.328 11 17 10.328 17 9.5C17 8.672 16.328 8 15.5 8C14.672 8 14 8.672 14 9.5C14 10.328 14.672 11 15.5 11Z" fill="currentColor"/>
      <path d="M12 2C6.477 2 2 6.037 2 11C2 13.4 3.1 15.5 4.9 17L4.3 20.5L8.1 18.3C9.3 18.7 10.6 19 12 19C12.3 19 12.6 18.98 12.9 18.94C12.34 17.7 12 16.3 12 14.8C12 10.3 15.8 6.6 20.5 6.1C19.1 3.6 15.8 2 12 2Z" fill="currentColor" opacity="0.7"/>
      <path d="M12 14.8C12 10.86 15.13 7.6 19.48 7.6C23.56 7.6 26.5 10.63 26.5 14.52C26.5 18.35 23.74 21.33 19.84 21.5C19.26 21.52 18.65 21.4 18 21.1L14.52 23L14.92 20.32C13.14 19.34 12 17.68 12 15.8V14.8Z" fill="currentColor" transform="translate(-2.5, -2)"/>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUserStore();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [phoneError, setPhoneError] = useState("");

  const TEST_CODE = "123456";

  const isValidPhone = (p: string) => /^1[3-9]\d{9}$/.test(p);

  const handlePhoneChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);
    if (digits.length === 11 && !isValidPhone(digits)) {
      setPhoneError("请输入正确的手机号格式");
    } else {
      setPhoneError("");
    }
  };

  const handleSendCode = () => {
    if (!isValidPhone(phone) || countdown > 0) return;
    setCodeSent(true);
    setCountdown(60);
    // 自动填入测试验证码
    setCode(TEST_CODE);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = () => {
    if (!isValidPhone(phone) || !code) return;
    if (code !== TEST_CODE) {
      alert("测试环境下验证码固定为 123456");
      return;
    }
    login();
    navigate("/", { replace: true });
  };

  const handleWechatLogin = () => {
    const isConfigured = getWechatAuthUrl().includes("wx_your_app_id");
    if (isConfigured) {
      // 生产环境：跳转到微信 OAuth 授权页
      window.location.href = getWechatAuthUrl();
    } else {
      // 开发环境：跳转到模拟回调页
      navigate("/oauth/callback?code=mock_code&state=mock_state");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 flex flex-col">
      {/* 品牌展示 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16">
        <Logo size="lg" />

        <h1 className="text-4xl font-display text-gradient mt-6 mb-3">拾光Campus</h1>
        <p className="text-gray-500 text-sm text-center max-w-xs leading-relaxed mb-10">
          遇见同频的你，在图书馆或晚霞里。
        </p>

        {/* 登录表单 */}
        <div className="w-full max-w-sm space-y-4">
          {/* 手机号 */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Smartphone className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white focus:ring-2 outline-none transition-all text-sm ${
                phoneError
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:border-cyan-400 focus:ring-cyan-100"
              }`}
              placeholder="输入手机号"
            />
            {phoneError && (
              <p className="text-xs text-red-500 mt-1 ml-2">{phoneError}</p>
            )}
          </div>

          {/* 验证码 */}
          <div className="relative flex gap-3">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="flex-1 pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-sm"
              placeholder="输入验证码"
            />
            <button
              onClick={handleSendCode}
              disabled={!isValidPhone(phone) || countdown > 0}
              className={`px-4 py-3.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isValidPhone(phone) && countdown === 0
                  ? "bg-cyan-50 text-cyan-600 border border-cyan-200 hover:bg-cyan-100"
                  : "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
              }`}
            >
              {countdown > 0 ? `${countdown}s` : codeSent ? "重新获取" : "获取验证码"}
            </button>
          </div>

          {/* 登录按钮 */}
          <button
            onClick={handleLogin}
            disabled={!isValidPhone(phone) || !code}
            className={`w-full py-3.5 rounded-xl text-white font-medium text-base transition-all ${
              isValidPhone(phone) && code
                ? "gradient-primary shadow-md shadow-cyan-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            登录 / 注册
          </button>
        </div>

        {/* 分割线 */}
        <div className="flex items-center gap-4 w-full max-w-sm mt-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">其他方式</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 微信登录 */}
        <button
          onClick={handleWechatLogin}
          className="mt-4 w-full max-w-sm flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium text-sm hover:border-green-300 hover:text-green-600 hover:bg-green-50 hover:shadow-sm transition-all"
        >
          <WechatIcon className="w-5 h-5 text-green-500" />
          微信登录
        </button>

        {/* 测试账号提示 */}
        <div className="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-200 max-w-sm w-full">
          <p className="text-xs font-medium text-amber-700 mb-1">
            测试环境说明
          </p>
          <p className="text-xs text-amber-600">
            测试手机号：<span className="font-mono font-bold">13812345678</span>
          </p>
          <p className="text-xs text-amber-600">
            测试验证码：<span className="font-mono font-bold">123456</span>
          </p>
        </div>

        {/* 学信网认证提示 */}
        <div className="mt-4 flex items-start gap-2 max-w-sm">
          <Shield className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-400 leading-relaxed">
            首次登录将自动注册。为保障校园真实社交环境，部分功能需完成学信网认证后方可使用。
          </p>
        </div>
      </div>

      {/* 底部 spacer */}
      <div className="h-12" />
    </div>
  );
}