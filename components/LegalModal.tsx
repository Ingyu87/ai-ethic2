"use client";

import { useEffect } from "react";

type Section = {
  heading: string;
  body: string;
};

type LegalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  effectiveDate?: string;
  intro?: string;
  sections: Section[];
};

export default function LegalModal({
  isOpen,
  onClose,
  title,
  effectiveDate,
  intro,
  sections,
}: LegalModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 id="legal-modal-title" className="text-lg font-bold text-gray-900">
              {title}
            </h2>
            {effectiveDate && (
              <p className="text-xs text-gray-500 mt-0.5">
                시행일: {effectiveDate}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors text-xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 text-sm text-gray-700 leading-relaxed space-y-5">
          {intro && (
            <p className="text-gray-600 whitespace-pre-line">{intro}</p>
          )}
          {sections.map((section) => (
            <section key={section.heading}>
              <h3 className="font-bold text-gray-900 mb-2">{section.heading}</h3>
              <p className="whitespace-pre-line">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-700 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
