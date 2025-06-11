import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FaInstagram, FaTwitter, FaFacebook, FaBars } from 'react-icons/fa';
import Image from "next/image";
import ClientLayout from "./ClientLayout";
import { AuthProvider } from "./components/NavbarAuthMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KurbanPazarım - Güvenilir Kurbanlık Alım Satım Platformu",
  description: "Güvenilir ve kaliteli kurbanlık hayvan alım satım platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`font-lubrifont ${inter.className}`}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
