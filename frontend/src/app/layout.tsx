import type { ReactNode } from "react";
import { Caveat, Kalam, JetBrains_Mono } from "next/font/google";
import Header from "@/components/shell/Header";
import Footer from "@/components/shell/Footer";
import AuthHydrator from "@/components/shell/AuthHydrator";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "The Dev Journal",
    template: "%s · The Dev Journal",
  },
  description:
    "The Dev Journal is a notebook-styled blog for engineers who work things out on paper before they publish.",
};

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
});
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${kalam.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <AuthHydrator />
        <Header />
        <main className="flex-1 bg-[#f3efe6]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}