import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const sss = [
  {
    soru: "Nasıl ilan eklerim?",
    cevap: "Sağ üstteki 'İlan Ekle' butonuna tıklayarak kolayca ilan ekleyebilirsiniz.",
  },
  {
    soru: "Ödeme nasıl yapılır?",
    cevap: "Satıcı ile iletişime geçip, güvenli ödeme yöntemlerinden birini kullanabilirsiniz.",
  },
  {
    soru: "Satıcıya nasıl ulaşırım?",
    cevap: "İlan detayında satıcı bilgileri ve iletişim seçenekleri yer alır.",
  },
  {
    soru: "Fotoğraf eklemek zorunlu mu?",
    cevap: "Hayır, ancak ilanınızın daha çok ilgi görmesi için fotoğraf eklemeniz önerilir.",
  },
];

export default function IlanSSS() {
  const [acik, setAcik] = useState<number | null>(null);
  return (
    <div className="my-12 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-green-700 text-center mb-6">Sıkça Sorulan Sorular</h3>
      <div className="space-y-4">
        {sss.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 border border-green-100">
            <button
              className="flex items-center justify-between w-full text-left text-lg font-semibold text-green-800 focus:outline-none"
              onClick={() => setAcik(acik === i ? null : i)}
            >
              {item.soru}
              <FaChevronDown className={`ml-2 transition-transform ${acik === i ? "rotate-180" : "rotate-0"}`} />
            </button>
            {acik === i && (
              <div className="mt-2 text-gray-700 text-base">{item.cevap}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 