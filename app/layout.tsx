import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore - no type declarations for CSS side-effect import
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Nav from "@/components/navbar/Nav";
import { Toaster } from "@/components/ui/sonner";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "jobDiary",
  description: "I need to walk before I can run",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
