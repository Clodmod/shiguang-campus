import { create } from "zustand";
import type { User, Post, Conversation, Message, MatchCandidate, PartnerRequest } from "@/types";
import { currentUser as mockCurrentUser, mockPosts, mockUsers, mockConversations, mockMessages, mockMatchCandidates, mockPartnerRequests } from "@/mock/data";

export const useUserStore = create<{
  currentUser: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  login: () => set({ currentUser: mockCurrentUser, isLoggedIn: true }),
  logout: () => set({ currentUser: null, isLoggedIn: false }),
  updateProfile: (data) =>
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...data } : null,
    })),
}));

export const usePostStore = create<{
  posts: Post[];
  activeTab: "recommend" | "following" | "academic";
  setActiveTab: (tab: "recommend" | "following" | "academic") => void;
  toggleLike: (postId: number) => void;
  toggleFavorite: (postId: number) => void;
  addComment: (postId: number, count?: number) => void;
}>((set) => ({
  posts: mockPosts.map((p) => ({ ...p, user: mockUsers.find((u) => u.id === p.user_id) })),
  activeTab: "recommend",
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, is_liked: !p.is_liked, like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1 }
          : p
      ),
    })),
  toggleFavorite: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, is_favorited: !p.is_favorited } : p
      ),
    })),
  addComment: (postId, count = 1) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, comment_count: p.comment_count + count } : p
      ),
    })),
}));

export const useMatchStore = create<{
  candidates: MatchCandidate[];
  matches: User[];
  swipedLeft: number[];
  swipedRight: number[];
  swipe: (candidateId: number, direction: "left" | "right") => void;
}>((set) => ({
  candidates: mockMatchCandidates,
  matches: [],
  swipedLeft: [],
  swipedRight: [],
  swipe: (candidateId, direction) =>
    set((state) => {
      const candidate = state.candidates.find((c) => c.id === candidateId);
      if (!candidate) return state;
      if (direction === "right") {
        const isMatch = Math.random() > 0.5;
        return {
          swipedRight: [...state.swipedRight, candidateId],
          matches: isMatch
            ? [...state.matches, candidate.user]
            : state.matches,
          candidates: state.candidates.filter((c) => c.id !== candidateId),
        };
      }
      return {
        swipedLeft: [...state.swipedLeft, candidateId],
        candidates: state.candidates.filter((c) => c.id !== candidateId),
      };
    }),
}));

export const useMessageStore = create<{
  conversations: Conversation[];
  messages: Record<number, Message[]>;
  sendMessage: (conversationId: number, content: string) => void;
  markRead: (conversationId: number) => void;
}>((set) => ({
  conversations: mockConversations,
  messages: mockMessages,
  sendMessage: (conversationId, content) =>
    set((state) => {
      const newMsg: Message = {
        id: Date.now(),
        conversation_id: conversationId,
        sender_id: 0,
        content,
        msg_type: "text",
        created_at: new Date().toISOString(),
      };
      const existing = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, newMsg],
        },
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? { ...c, last_message: content, last_message_at: new Date().toISOString() }
            : c
        ),
      };
    }),
  markRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unread_count: 0 } : c
      ),
    })),
}));

export const usePartnerStore = create<{
  requests: PartnerRequest[];
  addRequest: (req: PartnerRequest) => void;
  joinRequest: (id: number) => void;
}>((set) => ({
  requests: mockPartnerRequests.map((r) => ({
    ...r,
    user: mockUsers.find((u) => u.id === r.user_id),
  })),
  addRequest: (req) => set((state) => ({ requests: [req, ...state.requests] })),
  joinRequest: (id) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id && r.current_members < r.max_members
          ? { ...r, current_members: r.current_members + 1 }
          : r
      ),
    })),
}));