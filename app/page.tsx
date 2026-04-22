"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRINCIPLES = [
  { emoji: "🤖", text: "AI와의 약속", color: "#3B82F6" },
  { emoji: "✏️", text: "주도성", color: "#8B5CF6" },
  { emoji: "🎯", text: "합목적성", color: "#10B981" },
  { emoji: "🤝", text: "포용성", color: "#EC4899" },
  { emoji: "🛡️", text: "안전성", color: "#F59E0B" },
  { emoji: "💎", text: "투명성", color: "#14B8A6" },
];

export default function StartPage() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("5학년");
  const router = useRouter();

  const handleStart = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("playerName", name.trim() || "탐험가");
      localStorage.setItem("playerGrade", grade);
      localStorage.removeItem("gameResults");
      localStorage.removeItem("gameProgress");
    }
    router.push("/game");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Hero */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-3 inline-block animate-bounce">🤖</div>
          <h1 className="text-4xl font-black text-indigo-700 mb-2">
            AI 윤리 탐험대
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            AI를 올바르게 사용하는 방법을 배우는
            <br />
            <span className="font-bold text-indigo-500">
              스토리텔링 어드벤처 게임
            </span>
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {PRINCIPLES.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 text-center shadow-sm border"
              style={{ borderColor: p.color + "40" }}
            >
              <div className="text-2xl">{p.emoji}</div>
              <div className="text-xs font-semibold text-gray-600 mt-1">
                {p.text}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            🚀 탐험가 정보를 입력해요!
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                이름 (별명)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동 (안 써도 됩니다)"
                className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-indigo-400 text-base transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                학년
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-indigo-400 text-base transition-colors"
              >
                {["3학년", "4학년", "5학년", "6학년"].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="mt-5 w-full text-white font-black py-4 rounded-xl text-xl transition-all shadow-md active:scale-95"
            style={{ backgroundColor: "#4F46E5" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4338CA")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#4F46E5")
            }
          >
            🚀 탐험 시작하기!
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          총 6부 · 예상 소요 시간: 약 10분
        </p>
      </div>
    </div>
  );
}
