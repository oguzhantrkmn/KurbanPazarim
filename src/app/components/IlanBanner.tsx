import React from "react";
import { FaShieldAlt, FaStar, FaBullhorn } from "react-icons/fa";

export default function IlanBanner() {
  return (
    <div className="bg-gradient-to-r from-green-100 via-green-50 to-green-100 rounded-xl shadow flex flex-col md:flex-row items-center justify-between gap-6 p-6 mb-8 border border-green-200">
      <div className="flex items-center gap-4">
        <FaShieldAlt className="text-green-600 text-4xl" />
        <div>
          <div className="text-lg md:text-xl font-bold text-green-800">KurbanPazarım'da Güvenli Alışveriş</div>
          <div className="text-gray-700 text-sm md:text-base">Tüm satıcılar ve ilanlar özenle kontrol edilir. Güvenli ödeme ve iletişim imkanı.</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <FaStar className="text-yellow-500 text-3xl" />
        <span className="text-green-700 font-semibold">Avantajlı fiyatlar ve hızlı işlem!</span>
      </div>
      <div className="flex items-center gap-4">
        <FaBullhorn className="text-green-500 text-3xl" />
        <span className="text-green-700 font-semibold">Öne çıkan ilanlar her gün güncellenir.</span>
      </div>
    </div>
  );
} 