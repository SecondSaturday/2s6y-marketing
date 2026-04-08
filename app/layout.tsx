import type { Metadata } from "next";
import "./globals.css";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import Footer from "@/components/shared/Footer";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "2s6y - Monthly Friend Group Newsletters",
  description: "Stay connected with your closest friends through monthly group newsletters. Share updates, see what everyone is up to, and keep your friendships alive.",
  keywords: ["friend groups", "newsletters", "social", "stay connected", "monthly updates"],
  openGraph: {
    title: "2s6y - Monthly Friend Group Newsletters",
    description: "Stay connected with your closest friends through monthly group newsletters.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cupcake">
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} antialiased bg-base-300 text-base-content font-sans`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
