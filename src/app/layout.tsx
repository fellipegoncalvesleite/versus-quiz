import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

const description =
  "Race to type answers faster than your friends. Geography, sports, education, and more.";

export const metadata: Metadata = {
  applicationName: "Versus Quiz",
  title: {
    default: "Versus Quiz — Real-time Multiplayer Typing Quiz",
    template: "%s | Versus Quiz",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Versus Quiz",
    title: "Versus Quiz — Real-time Multiplayer Typing Quiz",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Versus Quiz — Real-time Multiplayer Typing Quiz",
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
