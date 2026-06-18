import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";

const body = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Panaderia y Pasteleria El Trigal — Pan dulce horneado fresco en Orange, NJ",
  description:
    "Panaderia mexicana en City of Orange, NJ. Pan dulce, conchas, bolillo, pasteles para toda ocasion y cafe, horneado fresco todos los dias desde las 6 de la manana. 23 S Essex Ave.",
  openGraph: {
    title: "Panaderia y Pasteleria El Trigal · Orange, NJ",
    description: "Pan dulce y pasteles horneados frescos cada manana en City of Orange, NJ.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${body.variable} antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=boska@400,500,700,1,2&display=swap"
        />
      </head>
      <body className="bg-flour text-crust-2 flour-grain min-h-screen">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
