"use client";

import { useState } from "react";
import LegalModal from "./LegalModal";
import {
  PRIVACY_OFFICER,
  PRIVACY_POLICY,
  SERVICE_NAME_EN,
  TERMS_OF_SERVICE,
} from "@/data/legal";

type ModalType = "terms" | "privacy" | null;

export default function Footer() {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  return (
    <>
      <footer className="bg-[#3c3f41] text-gray-100 py-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
            <a
              href="https://aiworld-ig.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-100 hover:text-white transition-colors"
            >
              © 2026 {SERVICE_NAME_EN}. All rights reserved.
            </a>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpenModal("terms")}
                className="font-bold text-gray-100 hover:text-white transition-colors"
              >
                이용약관
              </button>
              <span className="text-gray-500">|</span>
              <button
                type="button"
                onClick={() => setOpenModal("privacy")}
                className="font-bold text-gray-100 hover:text-white transition-colors"
              >
                개인정보처리방침
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-300">
            개인정보책임자: {PRIVACY_OFFICER.name} {PRIVACY_OFFICER.title} (
            {PRIVACY_OFFICER.school}) | 문의: {PRIVACY_OFFICER.phone}
          </p>
        </div>
      </footer>

      <LegalModal
        isOpen={openModal === "terms"}
        onClose={() => setOpenModal(null)}
        title={TERMS_OF_SERVICE.title}
        effectiveDate={TERMS_OF_SERVICE.effectiveDate}
        sections={TERMS_OF_SERVICE.sections}
      />

      <LegalModal
        isOpen={openModal === "privacy"}
        onClose={() => setOpenModal(null)}
        title={PRIVACY_POLICY.title}
        effectiveDate={PRIVACY_POLICY.effectiveDate}
        intro={PRIVACY_POLICY.intro}
        sections={PRIVACY_POLICY.sections}
      />
    </>
  );
}
