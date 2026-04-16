import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Versus Quiz",
  description: "Real-time multiplayer typing quiz",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
