import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2s6y - Monthly Friend Group Newsletters",
  description: "Remember when we actually knew what was going on in each other's lives? Share your story with monthly group newsletters.",
  icons: {
    icon: "/2s6y/favicon.svg",
  },
};

export default function SecondSaturdayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-theme="cupcake">
      {children}
    </div>
  );
}
