import React, { useState } from "react";

const turler = ["Tümü", "Büyükbaş", "Küçükbaş", "Deve", "Diğer"];
const iller = [
  "Tümü", "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
];

export default function IlanFiltre({ onChange }: { onChange: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    tur: "Tümü",
    il: "Tümü",
    ilce: "",
    minFiyat: "",
    maxFiyat: "",
    minKilo: "",
    maxKilo: "",
    search: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const updated = { ...prev, [name]: value };
      onChange(updated);
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-8 flex flex-wrap gap-4 items-end justify-between">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Tür</label>
        <select name="tur" value={filters.tur} onChange={handleChange} className="border rounded px-3 py-2">
          {turler.map(tur => <option key={tur} value={tur}>{tur}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">İl</label>
        <select name="il" value={filters.il} onChange={handleChange} className="border rounded px-3 py-2">
          {iller.map(il => <option key={il} value={il}>{il}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">İlçe</label>
        <input name="ilce" value={filters.ilce} onChange={handleChange} className="border rounded px-3 py-2" placeholder="İlçe" />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Fiyat (₺)</label>
        <div className="flex gap-2">
          <input name="minFiyat" value={filters.minFiyat} onChange={handleChange} className="border rounded px-2 py-2 w-20" placeholder="Min" type="number" />
          <input name="maxFiyat" value={filters.maxFiyat} onChange={handleChange} className="border rounded px-2 py-2 w-20" placeholder="Max" type="number" />
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Kilo (kg)</label>
        <div className="flex gap-2">
          <input name="minKilo" value={filters.minKilo} onChange={handleChange} className="border rounded px-2 py-2 w-20" placeholder="Min" type="number" />
          <input name="maxKilo" value={filters.maxKilo} onChange={handleChange} className="border rounded px-2 py-2 w-20" placeholder="Max" type="number" />
        </div>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-gray-700 font-semibold mb-1">Arama</label>
        <input name="search" value={filters.search} onChange={handleChange} className="border rounded px-3 py-2 w-full" placeholder="Anahtar kelime..." />
      </div>
    </div>
  );
} 