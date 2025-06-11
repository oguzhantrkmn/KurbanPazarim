"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FaEnvelope, FaLock, FaUserTie, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"alici" | "satici">("alici");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role,
        createdAt: new Date(),
      });
      // Doğrulama maili gönder
      await sendEmailVerification(userCredential.user);
      setCurrentUser(userCredential.user);
      setShowVerifyModal(true);
      // Yönlendirme kaldırıldı, doğrulama sonrası giriş yapılacak
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
      {/* Doğrulama Modalı */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-4"
          >
            <h3 className="text-xl font-bold text-green-700">Doğrulama Maili Gönderildi</h3>
            <p className="text-gray-700 text-sm">Lütfen <span className="font-semibold">{currentUser?.email}</span> adresine gelen doğrulama linkine tıkla.<br/>Doğrulama yaptıktan sonra giriş yapabilirsin.</p>
            <button
              className="mt-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              onClick={() => { setShowVerifyModal(false); router.push('/login'); }}
            >
              Giriş Yap
            </button>
          </motion.div>
        </div>
      )}
      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative z-10 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 border border-green-100"
      >
        <h2 className="text-3xl font-extrabold text-green-700 mb-2 text-center tracking-tight">Kayıt Ol</h2>
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
              minLength={6}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-gray-800 placeholder-gray-500 bg-white/90"
            />
          </div>
        </div>
        <div className="flex gap-4 justify-center my-2">
          <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition-all ${role === "alici" ? "bg-green-100 border border-green-400" : "bg-white border border-gray-200"}`}>
            <input
              type="radio"
              name="role"
              value="alici"
              checked={role === "alici"}
              onChange={() => setRole("alici")}
              className="accent-green-600"
            />
            <FaUser className="text-green-600" />
            <span className="text-gray-800">Alıcı</span>
          </label>
          <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition-all ${role === "satici" ? "bg-green-100 border border-green-400" : "bg-white border border-gray-200"}`}>
            <input
              type="radio"
              name="role"
              value="satici"
              checked={role === "satici"}
              onChange={() => setRole("satici")}
              className="accent-green-600"
            />
            <FaUserTie className="text-green-600" />
            <span className="text-gray-800">Satıcı</span>
          </label>
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
          {loading ? "Kaydediliyor..." : "Kayıt Ol"}
        </motion.button>
        <div className="text-center text-sm mt-2 text-gray-700">
          Zaten hesabın var mı? <a href="/login" className="text-green-700 hover:underline font-semibold">Giriş Yap</a>
        </div>
      </motion.form>
    </div>
  );
} 