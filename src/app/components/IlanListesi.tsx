import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";

function formatPrice(price: string | number) {
  if (!price) return "";
  return Number(price).toLocaleString("tr-TR");
}

function formatDate(date: any) {
  if (!date) return "";
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function IlanDetayModal({ ilan, onClose }: { ilan: any; onClose: () => void }) {
  if (!ilan) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl p-6 md:p-10 animate-fade-in border border-gray-200 max-h-screen overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-red-500 transition-colors font-bold">×</button>
        <h2 className="text-2xl font-extrabold mb-4 text-green-700 text-center tracking-tight">{ilan.tur} / {ilan.irk}</h2>
        {/* Fotoğraf galerisi */}
        <div className="flex gap-2 mb-4 overflow-x-auto justify-center">
          {ilan.images && ilan.images.length > 0 ? (
            ilan.images.map((img: string, i: number) => (
              <Image key={i} src={img} alt="ilan fotoğrafı" width={180} height={140} className="rounded-lg object-cover w-[180px] h-[140px]" />
            ))
          ) : (
            <div className="w-[180px] h-[140px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-4xl"><FaCamera /></div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-gray-700 mb-1">Yaş: <span className="font-semibold">{ilan.yas}</span></div>
            <div className="text-gray-700 mb-1">Kilo: <span className="font-semibold">{ilan.kilo} kg</span></div>
            <div className="text-gray-700 mb-1">Fiyat: <span className="text-red-600 font-bold text-xl">{formatPrice(ilan.fiyat)} ₺</span></div>
            <div className="text-gray-700 mb-1">İl / İlçe: <span className="font-semibold">{ilan.il} / {ilan.ilce}</span></div>
            <div className="text-gray-700 mb-1">Eklenme Tarihi: <span className="font-semibold">{formatDate(ilan.createdAt)}</span></div>
          </div>
          <div>
            <div className="text-gray-700 mb-2"><span className="font-semibold">Açıklama:</span><br />{ilan.aciklama || "-"}</div>
            {/* Mantıklı ekstra bilgiler: */}
            <div className="text-gray-700 mb-1">Satıcı ID: <span className="font-mono">{ilan.userId}</span></div>
            {/* Favorilere ekle, iletişim, vb. eklenebilir */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IlanListesi() {
  const [ilanlar, setIlanlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detayIlan, setDetayIlan] = useState<any | null>(null);

  useEffect(() => {
    async function fetchIlanlar() {
      try {
        const q = query(collection(db, "ilanlar"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        setIlanlar(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("İlanlar çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchIlanlar();
  }, []);

  if (loading) return <div className="text-center py-10">Yükleniyor...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mb-2 tracking-tight">Tüm İlanlar</h1>
      <p className="text-center text-gray-500 mb-8">Sistemdeki tüm güncel ilanları aşağıda bulabilirsiniz. Detay için ilana tıklayın.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ilanlar.map((ilan) => (
          <div
            key={ilan.id}
            className="bg-white rounded-2xl shadow-lg p-4 flex gap-4 items-center hover:shadow-2xl transition-all cursor-pointer border border-green-50 hover:border-green-200 group"
            onClick={() => setDetayIlan(ilan)}
          >
            <div className="flex-shrink-0">
              {ilan.images && ilan.images.length > 0 ? (
                <Image src={ilan.images[0]} alt="ilan fotoğrafı" width={110} height={90} className="rounded-xl object-cover w-[110px] h-[90px] group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-[110px] h-[90px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-3xl"><FaCamera /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-x-4 gap-y-1 items-center mb-1">
                <span className="font-bold text-green-800 text-lg">{ilan.tur}</span>
                <span className="text-gray-700 text-sm">{ilan.irk}</span>
                <span className="ml-auto text-red-600 font-bold text-xl">{formatPrice(ilan.fiyat)} ₺</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-600 text-sm mb-1">
                <span>Yaş: <span className="font-semibold text-gray-800">{ilan.yas}</span></span>
                <span>Kilo: <span className="font-semibold text-gray-800">{ilan.kilo} kg</span></span>
                <span>İl: <span className="font-semibold text-gray-800">{ilan.il}</span></span>
                <span>İlçe: <span className="font-semibold text-gray-800">{ilan.ilce}</span></span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-500 text-xs">
                <span>Eklenme: {formatDate(ilan.createdAt)}</span>
              </div>
              <button
                className="mt-2 px-4 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm shadow hover:bg-green-200 transition-colors"
                onClick={e => { e.stopPropagation(); setDetayIlan(ilan); }}
              >Detay</button>
            </div>
          </div>
        ))}
      </div>
      <IlanDetayModal ilan={detayIlan} onClose={() => setDetayIlan(null)} />
    </div>
  );
} 