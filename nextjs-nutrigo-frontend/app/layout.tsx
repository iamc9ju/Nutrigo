import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import "./globals.css";
import Footer from "@/component/Footer";

const anuphan = Anuphan({
  subsets: ["thai", "latin"],
  variable: "--font-anuphan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriConsult",
  description: "Personalized Nutrition Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anuphan.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
