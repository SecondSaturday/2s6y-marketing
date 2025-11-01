import type { Metadata } from "next";
import "./globals.css";
import { Instrument_Sans } from "next/font/google";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "2s6y - Monthly Friend Group Newsletters",
  description: "Remember when we actually knew what was going on in each other's lives? Share your story with monthly group newsletters.",
  icons: {
    icon: "/2s6y/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cupcake">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${instrumentSans.variable} antialiased bg-base-300 text-base-content font-sans`}>
        {children}
      </body>
    </html>
  );
}
