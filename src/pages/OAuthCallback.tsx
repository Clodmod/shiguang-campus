import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { useUserStore } from "@/store";
import { verifyState, exchangeCodeForToken, simulateWechatUser, WECHAT_CONFIG } from "@/utils/wechatOAuth";
import Logo from "@/components/common/Logo";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login, updateProfile } = useUserStore();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      setStatus("error");
      setErrorMsg("授权失败：未获取到授权码");
      return;
    }

    // 验证 state 防止 CSRF
    if (state && !verifyState(state)) {
      setStatus("error");
      setErrorMsg("安全验证失败：state 参数不匹配");
      return;
    }

    // 判断是否为微信开放平台真实回调
    const isRealWeChat = WECHAT_CONFIG.APP_ID !== "wx_your_app_id_here";

    if (isRealWeChat) {
      // ---------- 生产模式：调用后端交换 token ----------
      exchangeCodeForToken(code)
        .then((res) => {
          if (res.success && res.user) {
            updateProfile({
              nickname: res.user.nickname,
              avatar: res.user.avatar,
            });
            login();
            setStatus("success");
            setTimeout(() => navigate("/", { replace: true }), 1500);
          } else {
            setStatus("error");
            setErrorMsg(res.error || "登录失败，请重试");
          }
        })
        .catch((err) => {
          setStatus("error");
          setErrorMsg(err.message || "网络错误，请重试");
        });
    } else {
      // ---------- 开发/模拟模式：使用演示数据 ----------
      setTimeout(() => {
        const wechatUser = simulateWechatUser();
        updateProfile({
          nickname: wechatUser.nickname,
          avatar: wechatUser.avatar,
        });
        login();
        setStatus("success");
        setTimeout(() => navigate("/", { replace: true }), 1500);
      }, 800);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 flex flex-col items-center justify-center px-6">
      {/* 品牌 Logo */}
      <div className="relative mb-8">
        <Logo size="lg" />
        {status === "processing" && (
          <div className="absolute inset-0 rounded-2xl animate-ping bg-cyan-400 opacity-20" />
        )}
      </div>

      {/* 状态图标 */}
      <div className="mb-4">
        {status === "processing" && (
          <svg className="animate-spin w-10 h-10 text-cyan-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {status === "success" && <CheckCircle className="w-10 h-10 text-green-500" />}
        {status === "error" && <AlertCircle className="w-10 h-10 text-red-500" />}
      </div>

      {/* 状态文案 */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {status === "processing" && "微信授权登录中..."}
        {status === "success" && "授权成功！"}
        {status === "error" && "授权失败"}
      </h2>
      <p className="text-sm text-gray-400 text-center max-w-xs">
        {status === "processing" && "正在获取您的微信信息，请稍候"}
        {status === "success" && "即将跳转至首页"}
        {status === "error" && errorMsg}
      </p>

      {/* 错误重试按钮 */}
      {status === "error" && (
        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition-all"
        >
          返回登录页
        </button>
      )}
    </div>
  );
}