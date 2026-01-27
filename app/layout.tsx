import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BDSM Scene Creator",
  description: "Create personalized BDSM scenes based on preferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
