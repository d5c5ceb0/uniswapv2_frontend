import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UniswapV2 for Sepolia",
  description: "UniswapV2 for Sepolia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="bg-red-500 h-auto">
              <Header />
            </header>
            <main className="flex-1 w-1/2 m-auto">{children}</main>
            <footer className="bg-green-300 h-auto">
              <Footer />
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
