import type { Metadata } from "next";
import "./globals.css";
import { GlobalContextProvider } from "./context/GlobalContext";
import { inter, jetbrainsMono, fraunces } from "./fonts";

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
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ms_theme");document.documentElement.setAttribute("data-theme",t||"dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <GlobalContextProvider>
          {children}
        </GlobalContextProvider>
      </body>
    </html>
  );
}
