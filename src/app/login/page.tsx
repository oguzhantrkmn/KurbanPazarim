"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Firestore'dan rolü oku
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const role = userDoc.data()?.role;
      if (role === "alici") router.push("/alici");
      else if (role === "satici") router.push("/satici");
      else setError("Kullanıcı rolü bulunamadı.");
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 relative overflow-hidden">
      {/* Arka plan görseli (isteğe bağlı) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        className="absolute inset-0 z-0"
        style={{ background: 'url(/bg.png) center/cover no-repeat' }}
      />
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative z-10 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 border border-green-100"
      >
        <h2 className="text-3xl font-extrabold text-green-700 mb-2 text-center tracking-tight">Giriş Yap</h2>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-gray-800 placeholder-gray-500 bg-white/90"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-gray-800 placeholder-gray-500 bg-white/90"
            />
          </div>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-600 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-green-800 transition-all disabled:opacity-60"
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </motion.button>
        <div className="text-center text-sm mt-2 text-gray-700">
          Hesabın yok mu? <a href="/register" className="text-green-700 hover:underline font-semibold">Kayıt Ol</a>
        </div>
      </motion.form>
    </div>
  );
} 