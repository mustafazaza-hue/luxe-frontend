// app/(main)/layout.js
import { Inter } from "next/font/google";
import "../globals.css";

/* ✅ FontAwesome setup */
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

config.autoAddCss = false;

/* ✅ Google Fonts setup */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/* ✅ Metadata for SEO & Social Sharing */
export const metadata = {
  title: "LuxeSpace - Premium Furniture & AR Experience",
  description: "Discover premium furniture with immersive AR visualization. Try before you buy and elevate your living space with LuxeSpace.",
};

export default function MainLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}