import React from "react";
import { FaUserCircle, FaQuoteLeft } from "react-icons/fa";

const yorumlar = [
  {
    ad: "Mehmet K.",
    yorum: "KurbanPazarım sayesinde hayvanımı kolayca sattım, çok güvenli ve hızlı!",
  },
  {
    ad: "Ayşe T.",
    yorum: "Aradığım kurbanlığı burada buldum, satıcıyla iletişim çok kolaydı.",
  },
  {
    ad: "Ali V.",
    yorum: "Fiyatlar uygun, sistem çok pratik. Herkese tavsiye ederim!",
  },
];

export default function IlanYorumlar() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-bold text-green-700 text-center mb-6">Kullanıcı Yorumları</h3>
      <div className="flex flex-wrap gap-6 justify-center">
        {yorumlar.map((y, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 max-w-xs flex flex-col items-center border border-green-100">
            <FaUserCircle className="text-4xl text-green-400 mb-2" />
            <FaQuoteLeft className="text-green-200 text-xl mb-2" />
            <div className="text-gray-700 text-center mb-2">{y.yorum}</div>
            <div className="text-green-700 font-semibold">{y.ad}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 