import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-lg mx-auto pb-20 px-4 pt-4">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}