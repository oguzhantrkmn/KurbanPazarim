import React from "react";

export default function IlanIstatistik({ toplam, bugun, populerIrklar }: { toplam: number; bugun: number; populerIrklar: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center shadow">
        <span className="text-3xl font-bold text-green-700">{toplam}</span>
        <span className="text-gray-700 mt-2 font-semibold">Toplam İlan</span>
      </div>
      <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center shadow">
        <span className="text-3xl font-bold text-green-700">{bugun}</span>
        <span className="text-gray-700 mt-2 font-semibold">Bugün Eklenen</span>
      </div>
      <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center shadow">
        <span className="text-lg font-bold text-green-700 mb-2">En Popüler Irklar</span>
        <div className="flex flex-wrap gap-2 justify-center">
          {populerIrklar.map((irk, i) => (
            <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{irk}</span>
          ))}
        </div>
      </div>
    </div>
  );
} 