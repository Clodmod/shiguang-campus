import type { User, Post, Comment, MatchCandidate, Conversation, Message, PartnerRequest, CPRelationship, CPCheckin, LeaderboardEntry } from "@/types";

// 本地 SVG 头像生成器，不依赖任何外部 API
const palettes = [
  ["#00B4D8", "#0077B6"], ["#FF6B6B", "#EE5A24"], ["#A29BFE", "#6C5CE7"],
  ["#FD79A8", "#E84393"], ["#00CEC9", "#00B894"], ["#FDCB6E", "#E17055"],
  ["#74B9FF", "#0984E3"], ["#55EFC4", "#00B894"], ["#FAB1A0", "#E17055"],
  ["#81ECEC", "#00CEC9"], ["#E8A0BF", "#BA68C8"], ["#FFD93D", "#FF6B6B"],
];
const avatarChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function genAvatar(seed: number): string {
  const idx = seed % palettes.length;
  const [c1, c2] = palettes[idx];
  const char = avatarChars[seed % avatarChars.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="100" height="100" rx="50" fill="url(#g)"/>
    <text x="50" y="62" text-anchor="middle" fill="white" font-size="36" font-weight="700" font-family="Arial,sans-serif">${char}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const mockUsers: User[] = [
  { id: 1, phone: "138****1234", nickname: "代码诗人", avatar: genAvatar(1), school: "北京大学", major: "计算机科学与技术", grade: 3, gender: "male", mbti: "INTJ", interests: ["编程", "摄影", "跑步"], bio: "写代码的文艺青年，周末喜欢逛胡同拍照", is_verified: 1, created_at: "2024-09-01T08:00:00Z" },
  { id: 2, phone: "139****5678", nickname: "小确幸", avatar: genAvatar(2), school: "复旦大学", major: "新闻传播", grade: 2, gender: "female", mbti: "ENFP", interests: ["阅读", "旅行", "烘焙"], bio: "记录生活中的小美好，相信文字有力量", is_verified: 1, created_at: "2024-09-05T10:00:00Z" },
  { id: 3, phone: "137****9012", nickname: "物理小天才", avatar: genAvatar(3), school: "清华大学", major: "物理学", grade: 4, gender: "male", mbti: "INTP", interests: ["量子力学", "钢琴", "围棋"], bio: "在薛定谔的方程里寻找爱情的确定性", is_verified: 1, created_at: "2024-08-15T12:00:00Z" },
  { id: 4, phone: "136****3456", nickname: "画画的北北", avatar: genAvatar(4), school: "中国美术学院", major: "油画", grade: 2, gender: "female", mbti: "ISFP", interests: ["油画", "看展", "猫"], bio: "用画笔记录世界的美好", is_verified: 1, created_at: "2024-10-01T09:00:00Z" },
  { id: 5, phone: "135****7890", nickname: "马拉松选手", avatar: genAvatar(5), school: "浙江大学", major: "体育教育", grade: 3, gender: "male", mbti: "ESTP", interests: ["跑步", "篮球", "户外"], bio: "跑遍全国各大马拉松，下一站爱情赛道", is_verified: 1, created_at: "2024-09-20T14:00:00Z" },
  { id: 6, phone: "134****2345", nickname: "喵小姐", avatar: genAvatar(6), school: "南京大学", major: "汉语言文学", grade: 1, gender: "female", mbti: "INFJ", interests: ["写作", "猫咪", "民谣"], bio: "想和你分享我收藏的所有猫片", is_verified: 1, created_at: "2024-10-10T11:00:00Z" },
  { id: 7, phone: "133****6789", nickname: "算法能手", avatar: genAvatar(7), school: "上海交通大学", major: "人工智能", grade: 3, gender: "male", mbti: "ENTJ", interests: ["AI", "K-pop", "摄影"], bio: "用算法优化世界，用心感受你", is_verified: 1, created_at: "2024-09-12T16:00:00Z" },
  { id: 8, phone: "132****0123", nickname: "钢琴诗人", avatar: genAvatar(8), school: "中央音乐学院", major: "钢琴演奏", grade: 4, gender: "female", mbti: "INFP", interests: ["古典音乐", "诗歌", "瑜伽"], bio: "琴键上的浪漫主义", is_verified: 1, created_at: "2024-08-20T07:00:00Z" },
  { id: 9, phone: "131****4567", nickname: "美食猎人", avatar: genAvatar(9), school: "四川大学", major: "食品科学", grade: 2, gender: "female", mbti: "ESFJ", interests: ["美食", "探店", "拍照"], bio: "吃遍全城，带你发现宝藏小店", is_verified: 1, created_at: "2024-11-01T13:00:00Z" },
  { id: 10, phone: "130****8901", nickname: "摄影大叔", avatar: genAvatar(10), school: "武汉大学", major: "测绘工程", grade: 3, gender: "male", mbti: "ISTJ", interests: ["摄影", "爬山", "读书"], bio: "珞珈山下的光影记录者", is_verified: 1, created_at: "2024-09-08T15:00:00Z" },
  { id: 11, phone: "186****1111", nickname: "考研小王", avatar: genAvatar(11), school: "华中科技大学", major: "电子信息", grade: 4, gender: "male", mbti: "ISTP", interests: ["考研", "编程", "羽毛球"], bio: "每天图书馆打卡，求研友互相监督", is_verified: 1, created_at: "2024-10-05T10:00:00Z" },
  { id: 12, phone: "187****2222", nickname: "樱花少女", avatar: genAvatar(0), school: "武汉大学", major: "日语", grade: 1, gender: "female", mbti: "ENFJ", interests: ["动漫", "日语", "摄影"], bio: "想要去京都看樱花", is_verified: 1, created_at: "2024-10-15T09:00:00Z" },
];

export const currentUser: User = {
  id: 0,
  phone: "188****8888",
  nickname: "拾光小助手",
  avatar: genAvatar(13),
  school: "北京大学",
  major: "软件工程",
  grade: 3,
  gender: "male",
  mbti: "INFJ",
  interests: ["编程", "读书", "羽毛球"],
  bio: "在拾光校园，遇见同频的你",
  is_verified: 1,
  created_at: "2024-09-01T08:00:00Z",
};

export const mockPosts: Post[] = [
  {
    id: 1, user_id: 1, content: "图书馆闭馆时拍的晚霞，明天继续肝论文 📚🌅", images: ["https://picsum.photos/seed/post1/400/500"],
    tags: ["考研打卡", "校园风景"], category: "today", location: "北大图书馆", like_count: 42, comment_count: 5, created_at: "2024-12-01T18:30:00Z",
  },
  {
    id: 2, user_id: 2, content: "今日份的快乐是食堂新出的草莓蛋糕🍰", images: ["https://picsum.photos/seed/post2/400/500"],
    tags: ["美食", "日常"], category: "today", location: "复旦旦苑食堂", like_count: 28, comment_count: 3, created_at: "2024-12-01T12:00:00Z",
  },
  {
    id: 3, user_id: 3, content: "分享一份量子力学复习笔记，期末加油！📝", images: ["https://picsum.photos/seed/post3/400/500"],
    tags: ["学习笔记", "期末复习"], category: "academic", location: "清华图书馆", like_count: 89, comment_count: 12, created_at: "2024-11-30T20:00:00Z",
  },
  {
    id: 4, user_id: 4, content: "画室里的下午，光是最好的调色师🎨", images: ["https://picsum.photos/seed/post4/400/500"],
    tags: ["绘画", "艺术"], category: "today", location: "国美画室", like_count: 56, comment_count: 7, created_at: "2024-11-30T15:00:00Z",
  },
  {
    id: 5, user_id: 5, content: "周末环湖跑15km打卡！有人在紫金港一起跑吗？🏃", images: ["https://picsum.photos/seed/post5/400/500"],
    tags: ["跑步", "找跑友"], category: "partner", location: "浙大紫金港", like_count: 34, comment_count: 8, created_at: "2024-11-29T09:00:00Z",
  },
  {
    id: 6, user_id: 6, content: "今天在猫咖待了一下午，收获一腿猫毛🐱", images: ["https://picsum.photos/seed/post6/400/500"],
    tags: ["猫咪", "日常"], category: "today", location: "南大附近猫咖", like_count: 67, comment_count: 4, created_at: "2024-11-29T17:00:00Z",
  },
  {
    id: 7, user_id: 7, content: "用Transformer写了一首诗，AI也有浪漫的一面🤖❤️", images: ["https://picsum.photos/seed/post7/400/500"],
    tags: ["AI", "有趣实验"], category: "academic", location: "交大AI实验室", like_count: 73, comment_count: 9, created_at: "2024-11-28T22:00:00Z",
  },
  {
    id: 8, user_id: 8, content: "肖邦夜曲Op.9 No.2 练了一个月，终于录好了🎹", images: ["https://picsum.photos/seed/post8/400/500"],
    tags: ["钢琴", "音乐"], category: "today", location: "央音乐房", like_count: 91, comment_count: 11, created_at: "2024-11-28T19:00:00Z",
  },
  {
    id: 9, user_id: 9, content: "望平街新开的冰店，抹茶红豆冰绝绝子！🍧", images: ["https://picsum.photos/seed/post9/400/500"],
    tags: ["探店", "美食"], category: "today", location: "成都望平街", like_count: 45, comment_count: 6, created_at: "2024-11-27T14:00:00Z",
  },
  {
    id: 10, user_id: 10, content: "早起拍的珞珈山晨雾，仙境不过如此", images: ["https://picsum.photos/seed/post10/400/500"],
    tags: ["摄影", "校园风景"], category: "today", location: "武大珞珈山", like_count: 82, comment_count: 5, created_at: "2024-11-27T07:00:00Z",
  },
  {
    id: 11, user_id: 11, content: "求一个考研自习搭子！每天早八到晚九，互相监督💪", images: ["https://picsum.photos/seed/post11/400/500"],
    tags: ["考研", "找搭子"], category: "partner", location: "华科图书馆", like_count: 23, comment_count: 15, created_at: "2024-11-26T21:00:00Z",
  },
  {
    id: 12, user_id: 12, content: "武大的秋天，满校桂花香～", images: ["https://picsum.photos/seed/post12/400/500"],
    tags: ["校园风景", "秋天"], category: "today", location: "武大樱花大道", like_count: 58, comment_count: 3, created_at: "2024-11-26T16:00:00Z",
  },
];

export const mockComments: Comment[] = [
  { id: 1, post_id: 1, user_id: 2, content: "好美的晚霞！", created_at: "2024-12-01T19:00:00Z" },
  { id: 2, post_id: 1, user_id: 3, content: "加油，我也在肝论文😭", created_at: "2024-12-01T19:30:00Z" },
  { id: 3, post_id: 3, user_id: 1, content: "太强了，求分享笔记！", created_at: "2024-11-30T21:00:00Z" },
  { id: 4, post_id: 3, user_id: 4, content: "物理系大佬！", created_at: "2024-11-30T21:30:00Z" },
  { id: 5, post_id: 5, user_id: 10, content: "下次一起跑！", created_at: "2024-11-29T10:00:00Z" },
];

export const mockMatchCandidates: MatchCandidate[] = [
  { id: 1, user: mockUsers[1], distance: "0.5km", match_rate: 95 },
  { id: 2, user: mockUsers[3], distance: "1.2km", match_rate: 88 },
  { id: 3, user: mockUsers[5], distance: "2.0km", match_rate: 82 },
  { id: 4, user: mockUsers[7], distance: "3.5km", match_rate: 76 },
  { id: 5, user: mockUsers[8], distance: "0.8km", match_rate: 91 },
  { id: 6, user: mockUsers[11], distance: "1.5km", match_rate: 85 },
];

export const mockConversations: Conversation[] = [
  { id: 1, user: mockUsers[1], last_message: "周末一起去图书馆吧！", last_message_at: "2024-12-01T20:00:00Z", unread_count: 2 },
  { id: 2, user: mockUsers[3], last_message: "笔记发你了，加油！", last_message_at: "2024-11-30T22:00:00Z", unread_count: 0 },
  { id: 3, user: mockUsers[5], last_message: "明天早上6点操场见？", last_message_at: "2024-11-29T10:30:00Z", unread_count: 1 },
  { id: 4, user: mockUsers[7], last_message: "哈哈太有意思了", last_message_at: "2024-11-28T23:00:00Z", unread_count: 0 },
];

export const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, conversation_id: 1, sender_id: 1, content: "你也喜欢村上春树吗？", msg_type: "text", created_at: "2024-12-01T19:00:00Z" },
    { id: 2, conversation_id: 1, sender_id: 0, content: "是啊！最喜欢《挪威的森林》", msg_type: "text", created_at: "2024-12-01T19:01:00Z" },
    { id: 3, conversation_id: 1, sender_id: 1, content: "我也最爱这本！周末一起去图书馆吧！", msg_type: "text", created_at: "2024-12-01T20:00:00Z" },
  ],
  2: [
    { id: 1, conversation_id: 2, sender_id: 3, content: "同学你好，我看到你分享的笔记了", msg_type: "text", created_at: "2024-11-30T20:00:00Z" },
    { id: 2, conversation_id: 2, sender_id: 0, content: "谢谢！你在准备什么考试？", msg_type: "text", created_at: "2024-11-30T20:30:00Z" },
    { id: 3, conversation_id: 2, sender_id: 3, content: "量子力学期末", msg_type: "text", created_at: "2024-11-30T21:00:00Z" },
    { id: 4, conversation_id: 2, sender_id: 3, content: "笔记发你了，加油！", msg_type: "text", created_at: "2024-11-30T22:00:00Z" },
  ],
  3: [
    { id: 1, conversation_id: 3, sender_id: 5, content: "看到你也在找跑友！", msg_type: "text", created_at: "2024-11-29T09:30:00Z" },
    { id: 2, conversation_id: 3, sender_id: 0, content: "对啊！你一般什么时候跑？", msg_type: "text", created_at: "2024-11-29T09:35:00Z" },
    { id: 3, conversation_id: 3, sender_id: 5, content: "早上6点，明天操场见？", msg_type: "text", created_at: "2024-11-29T10:30:00Z" },
  ],
  4: [
    { id: 1, conversation_id: 4, sender_id: 7, content: "哈哈你写的AI诗太有趣了", msg_type: "text", created_at: "2024-11-28T22:30:00Z" },
    { id: 2, conversation_id: 4, sender_id: 0, content: "谢谢！要不要一起搞个AI项目？", msg_type: "text", created_at: "2024-11-28T22:45:00Z" },
    { id: 3, conversation_id: 4, sender_id: 7, content: "哈哈太有意思了，正有此意！", msg_type: "text", created_at: "2024-11-28T23:00:00Z" },
  ],
};

export const mockPartnerRequests: PartnerRequest[] = [
  { id: 1, user_id: 11, title: "考研自习搭子", description: "每天早上8点到晚上9点，华科图书馆五楼，互相监督", activity_type: "study", location: "华科图书馆", time: "每天 8:00-21:00", max_members: 4, current_members: 2, status: "recruiting", created_at: "2024-11-26T21:00:00Z" },
  { id: 2, user_id: 5, title: "周末晨跑搭子", description: "每周六早上6点绕西湖跑10km", activity_type: "sports", location: "西湖", time: "每周六 6:00", max_members: 6, current_members: 3, status: "recruiting", created_at: "2024-11-25T09:00:00Z" },
  { id: 3, user_id: 9, title: "周末探店觅食", description: "一起探索城里的宝藏小店，AA制", activity_type: "food", location: "市中心", time: "周末", max_members: 5, current_members: 1, status: "recruiting", created_at: "2024-11-24T14:00:00Z" },
  { id: 4, user_id: 2, title: "英语口语练习小组", description: "每周三晚7点英语角，练习口语", activity_type: "study", location: "复旦光华楼", time: "每周三 19:00", max_members: 8, current_members: 5, status: "recruiting", created_at: "2024-11-23T10:00:00Z" },
  { id: 5, user_id: 12, title: "周末桌游组队", description: "狼人杀/剧本杀，缺人上车", activity_type: "game", location: "校门口桌游吧", time: "周六下午", max_members: 10, current_members: 4, status: "recruiting", created_at: "2024-11-22T16:00:00Z" },
];

export const mockCP: CPRelationship = {
  id: 1,
  user1: { ...mockUsers[1], nickname: "小确幸" },
  user2: { ...mockUsers[0], nickname: "代码诗人" },
  days_count: 30,
  bind_at: "2024-11-01T00:00:00Z",
};

export const mockCheckins: CPCheckin[] = [
  { id: 1, cp_id: 1, task_name: "一起背单词", completed: 1, checkin_date: "2024-12-01" },
  { id: 2, cp_id: 1, task_name: "一起听播客", completed: 1, checkin_date: "2024-12-01" },
  { id: 3, cp_id: 1, task_name: "一起跑步", completed: 0, checkin_date: "2024-12-01" },
  { id: 4, cp_id: 1, task_name: "一起背单词", completed: 1, checkin_date: "2024-12-02" },
  { id: 5, cp_id: 1, task_name: "一起听播客", completed: 0, checkin_date: "2024-12-02" },
  { id: 6, cp_id: 1, task_name: "一起跑步", completed: 1, checkin_date: "2024-12-02" },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: 1, user: mockUsers[2], score: 980, rank: 1 },
  { id: 2, user: mockUsers[6], score: 920, rank: 2 },
  { id: 3, user: mockUsers[0], score: 880, rank: 3 },
  { id: 4, user: mockUsers[9], score: 850, rank: 4 },
  { id: 5, user: mockUsers[7], score: 820, rank: 5 },
  { id: 6, user: mockUsers[10], score: 790, rank: 6 },
  { id: 7, user: mockUsers[4], score: 760, rank: 7 },
  { id: 8, user: mockUsers[1], score: 730, rank: 8 },
];