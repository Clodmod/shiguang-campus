export interface User {
  id: number;
  phone: string;
  nickname: string;
  avatar: string;
  school: string;
  major: string;
  grade: number;
  gender: "male" | "female";
  mbti: string;
  interests: string[];
  bio: string;
  is_verified: number;
  created_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  user?: User;
  content: string;
  images: string[];
  tags: string[];
  category: "today" | "academic" | "partner";
  location: string;
  like_count: number;
  comment_count: number;
  is_liked?: boolean;
  is_favorited?: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  user?: User;
  content: string;
  created_at: string;
}

export interface MatchCandidate {
  id: number;
  user: User;
  distance: string;
  match_rate: number;
}

export interface Conversation {
  id: number;
  user: User;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  msg_type: "text" | "image" | "file" | "invite";
  created_at: string;
}

export interface PartnerRequest {
  id: number;
  user_id: number;
  user?: User;
  title: string;
  description: string;
  activity_type: "study" | "sports" | "food" | "game" | "other";
  location: string;
  time: string;
  max_members: number;
  current_members: number;
  status: "recruiting" | "full" | "ended";
  created_at: string;
}

export interface CPRelationship {
  id: number;
  user1: User;
  user2: User;
  days_count: number;
  bind_at: string;
}

export interface CPCheckin {
  id: number;
  cp_id: number;
  task_name: string;
  completed: number;
  checkin_date: string;
}

export interface LeaderboardEntry {
  id: number;
  user: User;
  score: number;
  rank: number;
}