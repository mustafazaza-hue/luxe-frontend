import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

/* ✅ FontAwesome setup */
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import AdminNavbar from "@/components/admin-navbar";
config.autoAddCss = false;
/* ==================== */

/* ✅ Google Fonts setup */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ✅ Metadata for SEO & Social Sharing */
export const metadata = {
  title: "LuxeSpace - Premium Furniture & AR Experience",
  description: "Discover premium furniture with immersive AR visualization. Try before you buy and elevate your living space with LuxeSpace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AdminNavbar></AdminNavbar>
        {children}
      </body>
    </html>
  )
}

