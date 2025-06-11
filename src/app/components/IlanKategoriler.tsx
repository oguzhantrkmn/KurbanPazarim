import React from "react";

const kategoriler = [
  { label: "Büyükbaş", value: "Büyükbaş" },
  { label: "Küçükbaş", value: "Küçükbaş" },
  { label: "Deve", value: "Deve" },
  { label: "Diğer", value: "Diğer" },
];

export default function IlanKategoriler({ selected, onSelect }: { selected: string; onSelect: (tur: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {kategoriler.map((kat) => (
        <button
          key={kat.value}
          onClick={() => onSelect(kat.value)}
          className={`px-5 py-2 rounded-full font-semibold shadow-sm border transition-colors text-base
            ${selected === kat.value ? "bg-green-600 text-white border-green-700" : "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"}`}
        >
          {kat.label}
        </button>
      ))}
    </div>
  );
} 