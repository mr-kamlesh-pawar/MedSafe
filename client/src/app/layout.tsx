import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedSafe — Clinical ADR Risk Intelligence",
  description: "AI-powered Adverse Drug Reaction prediction and alternative drug recommendation system for clinicians and pharmacists.",
  keywords: ["ADR", "drug safety", "clinical decision support", "pharmacovigilance", "MedSafe"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
