'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineUserGroup } from 'react-icons/hi';
import IlanListesi from "./components/IlanListesi";
import { useAuth } from "./components/NavbarAuthMenu";

export default function Home() {
  const auth = useAuth();
  if (auth && auth.user) {
    // Giriş yapmış kullanıcıya sadece ilanlar tablosu göster
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col items-center">
        <div className="w-full flex justify-center">
          <div className="max-w-5xl w-full">
            <IlanListesi />
          </div>
        </div>
      </main>
    );
  }
  // Giriş yapmamış kullanıcıya hero ve özellikler bölümü göster
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Şeffaf arka plan görseli */}
        <Image
          src="/bg.png"
          alt="Kurbanlık Arka Plan"
          fill
          className="object-cover object-center absolute inset-0 opacity-60"
          priority
        />
        {/* Şeffaflık ve blur efekti */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-700 mb-3 text-center tracking-tight">
            KurbanPazarım
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-6 text-center font-medium max-w-2xl">
            Modern, güvenilir ve animasyonlu kurbanlık pazarı. Minimalist, hızlı ve kullanıcı dostu deneyim.
          </p>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="bg-green-600/90 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-green-700 transition-colors"
          >
            Hemen Başla
          </motion.button>
        </motion.div>
      </section>

      {/* Özellikler Bölümü */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            className="bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl p-6 flex flex-col items-center shadow-sm transition-all"
          >
            <HiOutlineSearch className="text-4xl text-green-600 mb-3" />
            <h3 className="text-xl font-semibold mb-1 text-gray-800">Kolay Arama</h3>
            <p className="text-gray-500 text-center text-sm">İstediğiniz özelliklerde kurbanlık hayvanı kolayca bulun.</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            className="bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl p-6 flex flex-col items-center shadow-sm transition-all"
          >
            <HiOutlineShieldCheck className="text-4xl text-green-600 mb-3" />
            <h3 className="text-xl font-semibold mb-1 text-gray-800">Güvenli Alışveriş</h3>
            <p className="text-gray-500 text-center text-sm">Güvenli ödeme sistemi ile güvenle alışveriş yapın.</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            className="bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl p-6 flex flex-col items-center shadow-sm transition-all"
          >
            <HiOutlineUserGroup className="text-4xl text-green-600 mb-3" />
            <h3 className="text-xl font-semibold mb-1 text-gray-800">Uzman Desteği</h3>
            <p className="text-gray-500 text-center text-sm">Uzman ekibimiz her zaman yanınızda.</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
