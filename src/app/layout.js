import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers";
import Chatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";
import { ThemeContextProvider } from "@/lib/ThemeContext";
import { LanguageContextProvider } from "@/lib/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tourisia",
  description: "Authentication with NextAuth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageContextProvider>
            <ThemeContextProvider>
              <Navbar />
              {children}
              <Chatbot />
            </ThemeContextProvider>
          </LanguageContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
