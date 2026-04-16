import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roast Ledger",
  description: "A coffee beans catalog for tracking price, stock, taste notes, and ratings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
