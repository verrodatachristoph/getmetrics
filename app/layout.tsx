import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "getmetrics - Analytics in plain English",
  description: "Get your metrics, naturally. Talk to your analytics data using AI.",
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
