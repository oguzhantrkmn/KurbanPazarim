import React, { useState, useMemo } from "react";
import IlanBanner from "./IlanBanner";
import IlanIstatistik from "./IlanIstatistik";
import IlanKategoriler from "./IlanKategoriler";
import IlanFiltre from "./IlanFiltre";
import IlanListesi from "./IlanListesi";
import IlanYorumlar from "./IlanYorumlar";
import IlanSSS from "./IlanSSS";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function IlanlarSayfasi() {
  const [ilanlar, setIlanlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [kategori, setKategori] = useState<string>("");

  React.useEffect(() => {
    async function fetchIlanlar() {
      const q = query(collection(db, "ilanlar"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setIlanlar(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchIlanlar();
  }, []);

  // Filtreleme işlemi
  const filteredIlanlar = useMemo(() => {
    let data = [...ilanlar];
    if (kategori) data = data.filter(i => i.tur === kategori);
    if (filters.tur && filters.tur !== "Tümü") data = data.filter(i => i.tur === filters.tur);
    if (filters.il && filters.il !== "Tümü") data = data.filter(i => i.il === filters.il);
    if (filters.ilce) data = data.filter(i => i.ilce?.toLowerCase().includes(filters.ilce.toLowerCase()));
    if (filters.minFiyat) data = data.filter(i => Number(i.fiyat) >= Number(filters.minFiyat));
    if (filters.maxFiyat) data = data.filter(i => Number(i.fiyat) <= Number(filters.maxFiyat));
    if (filters.minKilo) data = data.filter(i => Number(i.kilo) >= Number(filters.minKilo));
    if (filters.maxKilo) data = data.filter(i => Number(i.kilo) <= Number(filters.maxKilo));
    if (filters.search) {
      const s = filters.search.toLowerCase();
      data = data.filter(i =>
        (i.tur && i.tur.toLowerCase().includes(s)) ||
        (i.irk && i.irk.toLowerCase().includes(s)) ||
        (i.aciklama && i.aciklama.toLowerCase().includes(s))
      );
    }
    return data;
  }, [ilanlar, filters, kategori]);

  // İstatistikler
  const toplam = ilanlar.length;
  const bugun = ilanlar.filter(i => {
    if (!i.createdAt) return false;
    const d = i.createdAt.toDate ? i.createdAt.toDate() : new Date(i.createdAt);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const populerIrklar = useMemo(() => {
    const sayac: Record<string, number> = {};
    ilanlar.forEach(i => {
      if (i.irk) sayac[i.irk] = (sayac[i.irk] || 0) + 1;
    });
    return Object.entries(sayac).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([irk]) => irk);
  }, [ilanlar]);

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0 py-8">
      <IlanBanner />
      <IlanIstatistik toplam={toplam} bugun={bugun} populerIrklar={populerIrklar} />
      <IlanKategoriler selected={kategori} onSelect={setKategori} />
      <IlanFiltre onChange={setFilters} />
      <IlanListesi ilanlar={filteredIlanlar} loading={loading} />
      <IlanYorumlar />
      <IlanSSS />
    </div>
  );
} 