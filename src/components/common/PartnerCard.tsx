import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users } from "lucide-react";
import type { PartnerRequest } from "@/types";
import { usePartnerStore } from "@/store";

interface PartnerCardProps {
  request: PartnerRequest;
}

export default function PartnerCard({ request }: PartnerCardProps) {
  const navigate = useNavigate();
  const { joinRequest } = usePartnerStore();

  const activityLabels: Record<string, string> = {
    study: "学习", sports: "运动", food: "美食", game: "游戏", other: "其他",
  };

  const activityColors: Record<string, string> = {
    study: "tag-cyan", sports: "tag-green", food: "tag-orange", game: "tag-pink", other: "tag",
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 card-hover">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={request.user?.avatar}
            alt=""
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => navigate(`/profile/${request.user_id}`)}
          />
          <div>
            <p className="font-medium text-sm text-gray-800">{request.user?.nickname}</p>
            <span className={`text-xs ${activityColors[request.activity_type]}`}>
              {activityLabels[request.activity_type]}
            </span>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          request.status === "recruiting" ? "bg-green-100 text-green-600" :
          request.status === "full" ? "bg-gray-100 text-gray-500" : "bg-red-50 text-red-400"
        }`}>
          {request.status === "recruiting" ? "招募中" : request.status === "full" ? "已满" : "已结束"}
        </span>
      </div>

      <h3 className="font-medium text-gray-800 mt-3">{request.title}</h3>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{request.description}</p>

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        {request.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {request.location}
          </span>
        )}
        {request.time && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {request.time}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {request.current_members}/{request.max_members}
        </span>
      </div>

      {request.status === "recruiting" && (
        <button
          onClick={() => joinRequest(request.id)}
          className="mt-3 w-full py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm font-medium rounded-xl hover:shadow-md transition-all"
        >
          申请加入
        </button>
      )}
    </div>
  );
}