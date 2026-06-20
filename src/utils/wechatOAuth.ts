/**
 * 微信开放平台 OAuth2.0 授权服务
 *
 * ### 接入前准备（生产环境必读）
 * 1. 在微信开放平台 (https://open.weixin.qq.com) 注册开发者账号
 * 2. 创建网站应用，获取 AppID 和 AppSecret
 * 3. 配置授权回调域名（需 ICP 备案）
 * 4. 确保服务器已部署 HTTPS
 *
 * ### 流程说明
 * 前端引导用户 → 微信授权页 → 用户确认 → 回调地址携带 code → 后端换取 access_token → 获取用户信息 → 登录成功
 */

// ========== 配置项（替换为真实值即可上线） ==========

export const WECHAT_CONFIG = {
  /** 微信开放平台分配的 AppID */
  APP_ID: "wx_your_app_id_here",

  /** 微信开放平台分配的 AppSecret（仅后端使用，绝不能暴露在前端） */
  APP_SECRET: "your_app_secret_here",

  /** 授权后的回调地址，需在微信开放平台配置白名单 */
  REDIRECT_URI: `${window.location.origin}/oauth/callback`,

  /** 授权作用域：snsapi_login（静默登录）或 snsapi_userinfo（弹窗获取用户信息） */
  SCOPE: "snsapi_login",

  /** 后端 OAuth 回调接口地址（用于交换 access_token） */
  BACKEND_TOKEN_URL: `${window.location.origin}/api/auth/wechat/token`,
};

// ========== 授权 URL 生成 ==========

/**
 * 生成微信 OAuth 授权跳转链接
 * 符合微信开放平台 OAuth2.0 标准
 */
export function getWechatAuthUrl(): string {
  const state = generateState();
  saveState(state);

  const params = new URLSearchParams({
    appid: WECHAT_CONFIG.APP_ID,
    redirect_uri: WECHAT_CONFIG.REDIRECT_URI,
    response_type: "code",
    scope: WECHAT_CONFIG.SCOPE,
    state,
  });

  return `https://open.weixin.qq.com/connect/qrconnect?${params.toString()}#wechat_redirect`;
}

// ========== state 参数（CSRF 防护） ==========

function generateState(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function saveState(state: string) {
  sessionStorage.setItem("wechat_oauth_state", state);
}

export function verifyState(state: string): boolean {
  const saved = sessionStorage.getItem("wechat_oauth_state");
  sessionStorage.removeItem("wechat_oauth_state");
  return saved === state;
}

// ========== 后端 API 调用 ==========

export interface WechatTokenResponse {
  success: boolean;
  user?: {
    id: number;
    nickname: string;
    avatar: string;
    openid: string;
    unionid?: string;
  };
  error?: string;
}

/**
 * 将微信授权 code 发送到后端，由后端完成 code→access_token 交换
 * 后端需将 WeChat userinfo 映射为平台用户并返回登录态
 */
export async function exchangeCodeForToken(code: string): Promise<WechatTokenResponse> {
  const response = await fetch(WECHAT_CONFIG.BACKEND_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(`登录失败 (${response.status})`);
  }

  return response.json();
}

// ========== 模拟模式（开发/演示环境用） ==========

const DEMO_WECHAT_USERS = [
  { nickname: "风中的承诺" },
  { nickname: "星辰大海" },
  { nickname: "暖阳" },
  { nickname: "追梦人" },
  { nickname: "山间明月" },
];

const wechatPalettes = [
  ["#00B4D8", "#0077B6"], ["#FF6B6B", "#EE5A24"], ["#A29BFE", "#6C5CE7"],
  ["#FD79A8", "#E84393"], ["#FDCB6E", "#E17055"],
];

function genWechatAvatar(nickname: string, seed: number): string {
  const [c1, c2] = wechatPalettes[seed % wechatPalettes.length];
  const char = nickname.charAt(0);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="100" height="100" rx="50" fill="url(#g)"/>
    <text x="50" y="62" text-anchor="middle" fill="white" font-size="36" font-weight="700" font-family="Arial,sans-serif">${char}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * 模拟微信授权回调（开发环境使用）
 * 生产环境下应由后端调用微信 API 获取真实用户信息
 */
export function simulateWechatUser() {
  const randomUser = DEMO_WECHAT_USERS[Math.floor(Math.random() * DEMO_WECHAT_USERS.length)];
  const seed = Date.now();
  return {
    id: seed,
    nickname: randomUser.nickname,
    avatar: genWechatAvatar(randomUser.nickname, seed),
    openid: `mock_openid_${Date.now()}`,
  };
}