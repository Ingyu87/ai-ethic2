"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GameResult } from "@/data/scenes";

const GRADE_CONFIG = [
  { min: 6, label: "AI 윤리 마스터", emoji: "🏆", color: "#F59E0B", message: "완벽해요! 당신은 진정한 AI 윤리 전문가예요!" },
  { min: 5, label: "AI 윤리 전문가", emoji: "⭐", color: "#8B5CF6", message: "훌륭해요! 거의 다 맞혔어요. AI를 정말 잘 알고 있어요!" },
  { min: 4, label: "AI 윤리 수련생", emoji: "🌟", color: "#3B82F6", message: "잘했어요! 조금 더 연습하면 마스터가 될 수 있어요!" },
  { min: 3, label: "AI 윤리 탐험가", emoji: "🌱", color: "#10B981", message: "좋아요! 배운 내용을 다시 한 번 복습해봐요!" },
  { min: 0, label: "AI 윤리 도전자", emoji: "💪", color: "#EC4899", message: "다시 도전해봐요! AI 윤리는 꼭 알아야 해요!" },
];

const SCENE_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#EC4899",
  "#F59E0B",
  "#14B8A6",
];

export default function ReportPage() {
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  const [playerName, setPlayerName] = useState("탐험가");
  const [playerGrade, setPlayerGrade] = useState("5학년");
  const [downloading, setDownloading] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gameResults");
      const name = localStorage.getItem("playerName") || "탐험가";
      const grade = localStorage.getItem("playerGrade") || "5학년";
      if (saved) setResults(JSON.parse(saved));
      setPlayerName(name);
      setPlayerGrade(grade);
      const d = new Date();
      setToday(`${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`);
    }
  }, []);

  const correctCount = results.filter((r) => r.isCorrect).length;
  const gradeConfig =
    GRADE_CONFIG.find((g) => correctCount >= g.min) || GRADE_CONFIG[4];

  const handleDownload = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `AI_윤리_탐험_리포트_${playerName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
      alert("다운로드 중 오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      setDownloading(false);
    }
  };

  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🤖</div>
          <p className="text-gray-600 mb-4">게임 결과를 찾을 수 없어요.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold"
          >
            처음으로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Celebration header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🎉</div>
          <h1 className="text-2xl font-black text-indigo-700">
            탐험 완료!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            6부의 여정을 모두 마쳤어요
          </p>
        </div>

        {/* Report card - this is what gets exported to PNG */}
        <div
          ref={reportRef}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{ fontFamily: "sans-serif" }}
        >
          {/* Report header */}
          <div
            className="px-6 py-5 text-white text-center"
            style={{
              background: `linear-gradient(135deg, #4F46E5, #7C3AED)`,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 4 }}>🤖</div>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 2 }}>
              나의 AI 윤리 탐험 결과 리포트
            </div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              {playerName} · {playerGrade} · {today}
            </div>
          </div>

          {/* Grade badge */}
          <div className="px-6 pt-5 pb-4 text-center border-b border-gray-100">
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-white"
              style={{ backgroundColor: gradeConfig.color }}
            >
              <span style={{ fontSize: 28 }}>{gradeConfig.emoji}</span>
              <div className="text-left">
                <div style={{ fontSize: 12, opacity: 0.9 }}>나의 등급</div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>
                  {gradeConfig.label}
                </div>
              </div>
              <div
                className="text-center ml-2 pl-3"
                style={{ borderLeft: "1px solid rgba(255,255,255,0.4)" }}
              >
                <div style={{ fontSize: 28, fontWeight: 900 }}>
                  {correctCount}
                </div>
                <div style={{ fontSize: 11, opacity: 0.9 }}>/ 6 정답</div>
              </div>
            </div>
            <p
              className="text-sm mt-3 font-semibold"
              style={{ color: gradeConfig.color }}
            >
              {gradeConfig.message}
            </p>
          </div>

          {/* Results table */}
          <div className="px-4 py-4">
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 8, paddingLeft: 4 }}>
              📋 부별 결과
            </div>
            <div className="space-y-2">
              {results.map((result, i) => (
                <div
                  key={result.sceneId}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    backgroundColor: result.isCorrect ? "#F0FDF4" : "#FFF1F2",
                    border: `1px solid ${result.isCorrect ? "#BBF7D0" : "#FECDD3"}`,
                  }}
                >
                  {/* Part badge */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: SCENE_COLORS[i] }}
                  >
                    {result.part.replace("부", "")}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>
                        {result.emoji} {result.principle}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>
                      {result.lesson}
                    </p>
                  </div>

                  {/* Result icon */}
                  <div className="flex-shrink-0 text-xl">
                    {result.isCorrect ? "✅" : "❌"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score summary */}
          <div className="mx-4 mb-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#22C55E" }}>
                  {correctCount}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>정답</div>
              </div>
              <div style={{ borderLeft: "1px solid #E5E7EB", borderRight: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#EF4444" }}>
                  {results.length - correctCount}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>오답</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#4F46E5" }}>
                  {Math.round((correctCount / results.length) * 100)}%
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>정답률</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 text-center bg-gray-50 border-t border-gray-100">
            <p style={{ fontSize: 11, color: "#9CA3AF" }}>
              🤖 AI 윤리 탐험대 · AI를 올바르게 사용하는 디지털 시민
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 space-y-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full text-white font-black py-4 rounded-xl text-base transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ backgroundColor: "#4F46E5" }}
            onMouseEnter={(e) => !downloading && (e.currentTarget.style.backgroundColor = "#4338CA")}
            onMouseLeave={(e) => !downloading && (e.currentTarget.style.backgroundColor = "#4F46E5")}
          >
            {downloading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                저장 중...
              </>
            ) : (
              <>📥 리포트 PNG로 저장하기</>
            )}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-white text-indigo-600 font-bold py-4 rounded-xl text-base transition-all active:scale-95 shadow border-2 border-indigo-200 hover:bg-indigo-50"
          >
            🔄 다시 탐험하기
          </button>
        </div>
      </div>
    </div>
  );
}
