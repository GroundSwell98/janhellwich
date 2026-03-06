import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import LenisProvider from "@/lib/lenis";
import "./globals.css";

const mabryPro = localFont({
  src: "../fonts/MabryPro-Regular.ttf",
  variable: "--font-mabry",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EDEDEB",
};

export const metadata: Metadata = {
  title: "Jan Hellwich Work",
  description:
    "Jan Hellwich is a director exploring culturally significant themes through strong visual narratives.",
  openGraph: {
    title: "Jan Hellwich Work",
    description:
      "Director exploring culturally significant themes through strong visual narratives. Cannes YDA Gold winner.",
    type: "website",
    url: "https://janhellwich.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`${mabryPro.variable} antialiased`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
