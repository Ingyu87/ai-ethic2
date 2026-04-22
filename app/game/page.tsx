"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { scenes, GameResult } from "@/data/scenes";

type GamePhase = "story" | "choices" | "feedback";

export default function GamePage() {
  const router = useRouter();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("story");
  const [selectedChoice, setSelectedChoice] = useState<"A" | "B" | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showStreakBadge, setShowStreakBadge] = useState(false);
  const [resultFlash, setResultFlash] = useState<"correct" | "wrong" | null>(null);
  const [choiceStartTime, setChoiceStartTime] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  const scene = scenes[sceneIndex];
  const progress = ((sceneIndex + (phase === "feedback" ? 1 : 0)) / scenes.length) * 100;

  // 마운트 시 저장된 진행상황 복원
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gameProgress");
      if (saved) {
        const { sceneIndex, phase, selectedChoice, results } = JSON.parse(saved);
        setSceneIndex(sceneIndex);
        setPhase(phase);
        setSelectedChoice(selectedChoice);
        setResults(results);
      }
    }
  }, []);

  // 상태 변경 시 진행상황 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "gameProgress",
        JSON.stringify({ sceneIndex, phase, selectedChoice, results })
      );
    }
  }, [sceneIndex, phase, selectedChoice, results]);

  useEffect(() => {
    setVisible(true);
    if (phase === "choices") setChoiceStartTime(Date.now());
  }, [sceneIndex, phase]);

  const handleChoiceSelect = (choiceId: "A" | "B") => {
    if (transitioning) return;
    const elapsed = Math.round((Date.now() - choiceStartTime) / 1000);
    setElapsedSec(elapsed);

    const choice = scene.choices.find((c) => c.id === choiceId)!;
    const stars = choice.isCorrect ? 3 : 1;

    if (choice.isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak >= 3) {
        setShowStreakBadge(true);
        setTimeout(() => setShowStreakBadge(false), 2000);
      }
    } else {
      setStreak(0);
    }

    setResultFlash(choice.isCorrect ? "correct" : "wrong");
    setTimeout(() => setResultFlash(null), 400);

    setSelectedChoice(choiceId);
    setPhase("feedback");
    const newResult: GameResult = {
      sceneId: scene.id,
      part: scene.part,
      principle: scene.principle,
      emoji: scene.emoji,
      selectedChoice: choiceId,
      isCorrect: choice.isCorrect,
      lesson: choice.lesson,
      stars,
    };
    setResults((prev) => [...prev, newResult]);
  };

  const handleNext = () => {
    if (transitioning) return;
    setTransitioning(true);
    setVisible(false);

    setTimeout(() => {
      if (sceneIndex < scenes.length - 1) {
        setSceneIndex((prev) => prev + 1);
        setPhase("story");
        setSelectedChoice(null);
      } else {
        const allResults = [...results];
        if (typeof window !== "undefined") {
          localStorage.setItem("gameResults", JSON.stringify(allResults));
          localStorage.removeItem("gameProgress");
        }
        router.push("/report");
        return;
      }
      setTransitioning(false);
    }, 350);
  };

  const selectedChoiceData = selectedChoice
    ? scene.choices.find((c) => c.id === selectedChoice)
    : null;

  return (
    <div
      className="min-h-screen flex flex-col items-center py-6 px-4"
      style={{ backgroundColor: scene.color.light }}
    >
      {/* Flash overlay */}
      {resultFlash && (
        <div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            backgroundColor: resultFlash === "correct" ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)",
            animation: "flashFade 0.4s ease-out forwards",
          }}
        />
      )}
      <style>{`@keyframes flashFade { from { opacity:1 } to { opacity:0 } }`}</style>

      {/* Streak badge */}
      {showStreakBadge && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-orange-500 text-white px-5 py-2 rounded-full font-black text-lg shadow-lg animate-bounce">
          🔥 {streak}연속 정답!
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-2">
        <button
          onClick={() => setShowExitModal(true)}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
        >
          ← 처음으로
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold" style={{ color: scene.color.text }}>
            {scene.part}
          </span>
          <span className="text-sm text-gray-500">
            {sceneIndex + 1} / {scenes.length}장면
          </span>
        </div>
        <div className="w-full h-3 bg-white rounded-full shadow-inner overflow-hidden border border-gray-100">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              backgroundColor: scene.color.primary,
            }}
          />
        </div>
      </div>

      {/* Scene card */}
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 text-white"
          style={{ backgroundColor: scene.color.primary }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{scene.emoji}</span>
            <div>
              <div className="text-sm font-semibold opacity-90">{scene.part}</div>
              <div className="text-lg font-black">{scene.principle}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Story Phase */}
          {phase === "story" && (
            <div className="animate-fade-in">
              <div className="space-y-4 mb-6">
                {scene.situation.map((text, i) => (
                  <p key={i} className="text-gray-700 text-base leading-relaxed">
                    {text}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setPhase("choices")}
                className="w-full text-white font-bold py-4 rounded-xl text-base transition-all active:scale-95 shadow"
                style={{ backgroundColor: scene.color.primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.filter = "brightness(0.9)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.filter = "brightness(1)")
                }
              >
                선택하러 가기 →
              </button>
            </div>
          )}

          {/* Choices Phase */}
          {phase === "choices" && (
            <div className="animate-fade-in">
              <button
                onClick={() => setPhase("story")}
                className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-3"
              >
                ← 내용 다시 보기
              </button>
              <p
                className="font-bold text-base mb-5 text-center px-2"
                style={{ color: scene.color.text }}
              >
                💬 {scene.question}
              </p>
              <div className="space-y-3">
                {scene.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice.id)}
                    className="w-full text-left bg-white border-2 rounded-xl px-5 py-4 transition-all active:scale-95 hover:shadow-md"
                    style={{ borderColor: scene.color.border }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = scene.color.primary;
                      e.currentTarget.style.backgroundColor = scene.color.light;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = scene.color.border;
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="text-sm font-black w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white mt-0.5"
                        style={{ backgroundColor: scene.color.primary }}
                      >
                        {choice.id}
                      </span>
                      <span className="text-gray-800 text-sm leading-relaxed">
                        {choice.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Phase */}
          {phase === "feedback" && selectedChoiceData && (
            <div className="animate-fade-in">
              {/* Result badge */}
              <div
                className={`rounded-xl p-4 mb-4 border-2 ${
                  selectedChoiceData.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {selectedChoiceData.isCorrect ? "✅" : "❌"}
                  </span>
                  <span
                    className={`font-black text-lg ${
                      selectedChoiceData.isCorrect
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {selectedChoiceData.isCorrect
                      ? "정답이에요!"
                      : "아쉬워요!"}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedChoiceData.feedback}
                </p>
              </div>

              {/* Stars + elapsed time */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="text-xl">
                  {selectedChoiceData.isCorrect ? "⭐⭐⭐" : "⭐"}
                </div>
                <div className="text-xs text-gray-400">
                  ⏱ {elapsedSec}초 만에 선택
                </div>
              </div>

              {/* Lesson */}
              <div
                className="rounded-xl p-4 mb-5"
                style={{
                  backgroundColor: scene.color.light,
                  borderLeft: `4px solid ${scene.color.primary}`,
                }}
              >
                <p className="text-xs font-black mb-1" style={{ color: scene.color.text }}>
                  💡 핵심 배움
                </p>
                <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                  {selectedChoiceData.lesson}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="w-full text-white font-bold py-4 rounded-xl text-base transition-all active:scale-95 shadow"
                style={{ backgroundColor: scene.color.primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.filter = "brightness(0.9)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.filter = "brightness(1)")
                }
              >
                {sceneIndex < scenes.length - 1
                  ? "다음 장면으로 →"
                  : "🎉 결과 리포트 보기!"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exit modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <p className="font-bold text-lg text-gray-800 mb-2">게임을 나가시겠어요?</p>
            <p className="text-sm text-gray-500 mb-5">
              진행상황은 저장되어 있어요. 나중에 이어할 수 있습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 border-2 border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                계속하기
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700"
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Part dots */}
      <div className="flex gap-2 mt-5">
        {scenes.map((s, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{
              backgroundColor:
                i < sceneIndex
                  ? "#22C55E"
                  : i === sceneIndex
                    ? scene.color.primary
                    : "#D1D5DB",
              transform: i === sceneIndex ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
