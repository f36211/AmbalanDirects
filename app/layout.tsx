import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ambalan Sma Ummul Quro Bogor",
  description: "Website resmi Ambalan Sma Ummul Quro Bogor",
  icons: {
    icon: [
      {
        url: '/logo.webp',
        type: 'image/webp',
        sizes: '32x32',
      },
      {
        url: '/logo.webp',
        type: 'image/webp',
        sizes: '16x16',
      }
    ],
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.webp" type="image/webp" sizes="32x32" />
        <link rel="icon" href="/logo.webp" type="image/webp" sizes="16x16" />
        <link rel="shortcut icon" href="/logo.webp" />
        <link rel="apple-touch-icon" href="/logo.webp" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}