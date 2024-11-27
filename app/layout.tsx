import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalContextProvider } from "./context/GlobalContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Monkey Solutions",
  description: "Developed by Monkey Solutions AB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalContextProvider>
          {children}
          <footer className="py-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Monkey Solutions. All rights reserved.
          </footer>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
