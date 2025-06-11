"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaUserCircle, FaSignOutAlt, FaUser, FaHeart, FaList } from "react-icons/fa";

const AuthContext = createContext<any>(null);
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setRole(userDoc.data()?.role || null);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function NavbarAuthMenu() {
  const { user, role, loading } = useAuth();
  const [open, setOpen] = useState(false);
  if (loading) return null;
  if (!user) {
    return (
      <a
        href="/login"
        className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-md"
      >
        Giriş Yap
      </a>
    );
  }
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 text-green-700 hover:text-green-900 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <FaUserCircle className="text-3xl" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 animate-fade-in">
          <a href="/profil" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50">
            <FaUser /> Profil
          </a>
          {role === "satici" && (
            <a href="/ilanlarim" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50">
              <FaList /> İlanlarım
            </a>
          )}
          {role === "alici" && (
            <a href="/favorilerim" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50">
              <FaHeart /> Favorilerim
            </a>
          )}
          <button
            onClick={() => { signOut(auth); window.location.href = "/"; }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
          >
            <FaSignOutAlt /> Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
} 