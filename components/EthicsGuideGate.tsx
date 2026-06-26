"use client";

import {
  ETHICS_GUIDE_ACCEPT_LABEL,
  ETHICS_GUIDE_ITEMS,
  ETHICS_GUIDE_TITLE,
  type CoreValue,
} from "@/data/ethicsGuide";

type EthicsGuideGateProps = {
  onAccept: () => void;
};

function ValueBadge({ value }: { value: CoreValue }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap"
      style={{ color: value.color, backgroundColor: value.bg }}
    >
      <span aria-hidden>{value.icon}</span>
      {value.label}
    </span>
  );
}

export default function EthicsGuideGate({ onAccept }: EthicsGuideGateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-t-2xl px-4 py-4 sm:px-6 sm:py-5 text-center"
            style={{ backgroundColor: "#F5A623" }}
          >
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {ETHICS_GUIDE_TITLE}
            </h1>
          </div>

          <div className="bg-white rounded-b-2xl shadow-lg border border-amber-100 overflow-hidden">
            <div
              className="hidden sm:grid sm:grid-cols-[140px_1fr] border-b-2"
              style={{ borderColor: "#F5A623", backgroundColor: "#FFF8E7" }}
            >
              <div className="px-4 py-3 text-sm font-black text-gray-700 border-r border-amber-100">
                핵심 가치
              </div>
              <div className="px-4 py-3 text-sm font-black text-gray-700">
                핵심 가이드
              </div>
            </div>

            {ETHICS_GUIDE_ITEMS.map((item, index) => (
              <article
                key={item.id}
                className={`sm:grid sm:grid-cols-[140px_1fr] ${
                  index < ETHICS_GUIDE_ITEMS.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="px-4 pt-4 sm:py-5 sm:border-r border-gray-100 bg-gray-50/60 sm:bg-white">
                  <p className="sm:hidden text-[11px] font-bold text-gray-400 mb-2">
                    핵심 가치
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.values.map((value) => (
                      <ValueBadge key={value.label} value={value} />
                    ))}
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 sm:py-5">
                  <p className="sm:hidden text-[11px] font-bold text-gray-400 mb-2">
                    핵심 가이드
                  </p>
                  <p
                    className="text-sm font-bold mb-2"
                    style={{ color: "#D97706" }}
                  >
                    {item.guideLabel}
                  </p>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 leading-snug mb-2">
                    {item.headline}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-amber-200 bg-white/95 backdrop-blur px-4 py-4 sm:py-5">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={onAccept}
            className="w-full rounded-2xl px-4 py-4 text-sm sm:text-base font-black text-white shadow-lg transition-all hover:brightness-105 active:scale-[0.99]"
            style={{ backgroundColor: "#EA580C" }}
          >
            {ETHICS_GUIDE_ACCEPT_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
