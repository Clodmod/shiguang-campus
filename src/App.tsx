import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Match from "@/pages/Match";
import Messages from "@/pages/Messages";
import MessageDetail from "@/pages/MessageDetail";
import PostDetail from "@/pages/PostDetail";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import Login from "@/pages/Login";
import Partner from "@/pages/Partner";
import Love from "@/pages/Love";
import Leaderboard from "@/pages/Leaderboard";
import UserProfile from "@/pages/UserProfile";
import Settings from "@/pages/Settings";
import OAuthCallback from "@/pages/OAuthCallback";
import Layout from "@/components/layout/Layout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<Match />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:conversationId" element={<MessageDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/love" element={<Love />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </Router>
  );
}