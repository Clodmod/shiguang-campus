import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, Sparkles } from "lucide-react";
import { useMatchStore } from "@/store";
import type { MatchCandidate } from "@/types";

function SwipeCard({
  candidate,
  onSwipe,
  onSwipeComplete,
}: {
  candidate: MatchCandidate;
  onSwipe: (direction: "left" | "right") => void;
  onSwipeComplete: () => void;
}) {
  const { user, match_rate } = candidate;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacityRight = useTransform(x, [0, 100], [0, 1]);
  const opacityLeft = useTransform(x, [-100, 0], [1, 0]);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 w-full h-full"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_event, info) => {
        if (info.offset.x > 100) {
          onSwipe("right");
          onSwipeComplete();
        } else if (info.offset.x < -100) {
          onSwipe("left");
          onSwipeComplete();
        }
      }}
      whileDrag={{ scale: 1.02 }}
      animate={{ scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="w-full h-full rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col">
        {/* Drag indicators */}
        <motion.div
          className="absolute top-8 left-6 z-10 px-4 py-2 border-4 border-green-500 rounded-xl"
          style={{ opacity: opacityRight, rotate: -15 }}
        >
          <span className="text-2xl font-bold text-green-500">♥ 喜欢</span>
        </motion.div>
        <motion.div
          className="absolute top-8 right-6 z-10 px-4 py-2 border-4 border-red-500 rounded-xl"
          style={{ opacity: opacityLeft, rotate: 15 }}
        >
          <span className="text-2xl font-bold text-red-500">✖ 跳过</span>
        </motion.div>

        {/* Avatar area */}
        <div className="relative h-1/2 bg-gradient-to-br from-cyan-100 to-blue-50 flex items-center justify-center">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>

        {/* Info area */}
        <div className="flex-1 px-6 pt-5 pb-4 flex flex-col">
          {/* Name + School + MBTI */}
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold text-gray-800">{user.nickname}</h2>
            <div className="flex items-center justify-center gap-2 mt-1 text-sm text-gray-500">
              <span>{user.school}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="font-medium text-purple-600">{user.mbti}</span>
            </div>
          </div>

          {/* Interest tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-600 border border-cyan-100"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Match rate */}
          <div className="mt-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-semibold text-pink-600">
                匹配度 {match_rate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MatchSuccessModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl px-10 py-12 shadow-2xl flex flex-col items-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart className="w-16 h-16 text-pink-500 fill-pink-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              配对成功！🎉
            </h2>
            <p className="text-gray-500 mt-2">你们已经互相喜欢，快开始聊天吧！</p>
            <motion.button
              className="mt-6 gradient-love text-white font-medium py-2.5 px-8 rounded-xl shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
            >
              开始聊天
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Match() {
  const { candidates, swipe } = useMatchStore();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [swiping, setSwiping] = useState(false);

  const handleSwipe = (direction: "left" | "right") => {
    if (candidates.length === 0 || swiping) return;
    const first = candidates[0];
    swipe(first.id, direction);

    if (direction === "right") {
      setShowMatchModal(true);
    }
  };

  const handleSwipeComplete = () => {
    setSwiping(true);
    // Reset swiping flag after animation
    setTimeout(() => setSwiping(false), 300);
  };

  const closeMatchModal = () => setShowMatchModal(false);

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Heart className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600">
          暂时没有更多推荐了
        </h3>
        <p className="text-sm text-gray-400 mt-1">请稍后再来看看吧～</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full pt-2">
      <h1 className="text-lg font-bold text-gray-800 mb-4">心动匹配</h1>

      {/* Card container */}
      <div className="relative w-full max-w-sm" style={{ height: "70vh" }}>
        {/* Stack of cards (show max 2 for depth effect) */}
        {candidates.slice(0, 2).reverse().map((candidate, index) => {
          const isTop = index === candidates.slice(0, 2).length - 1;
          return (
            <div
              key={candidate.id}
              className="absolute inset-0"
              style={{
                transform: `scale(${1 - index * 0.03}) translateY(${index * 8}px)`,
                zIndex: candidates.length - index,
              }}
            >
              {isTop ? (
                <SwipeCard
                  candidate={candidate}
                  onSwipe={handleSwipe}
                  onSwipeComplete={handleSwipeComplete}
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-white/80 shadow-md border border-gray-100" />
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6 mt-6">
        <motion.button
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            handleSwipe("left");
            handleSwipeComplete();
          }}
        >
          <X className="w-7 h-7 text-red-400" />
        </motion.button>
        <motion.button
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            handleSwipe("right");
            handleSwipeComplete();
          }}
        >
          <Heart className="w-7 h-7 text-pink-500" />
        </motion.button>
      </div>

      <p className="text-xs text-gray-400 mt-3">左滑跳过 · 右滑喜欢</p>

      {/* Match success modal */}
      <MatchSuccessModal show={showMatchModal} onClose={closeMatchModal} />
    </div>
  );
}