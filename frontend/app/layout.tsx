import BottomNavbar from "@/component/BottomNavbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {UserProvider} from "@/component/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReviVe",
  description: "Buy and sell electronics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>
          <div className="pb-16" style={{ maxHeight: "93vh" }}>
            {children}
          </div>
          <BottomNavbar />
        </body>
      </UserProvider>
    </html>
  );
}
