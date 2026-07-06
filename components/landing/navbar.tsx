import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-road-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-road-600 text-lg">🚗</span>
          <span className="font-display text-lg font-extrabold text-road-900">RentalKu</span>
        </Link>
        <nav className="hidden items-center gap-7 sm:flex">
          <a href="#armada" className="text-sm font-medium text-road-900/70 hover:text-road-600">Armada</a>
          <a href="#hero" className="text-sm font-medium text-road-900/70 hover:text-road-600">Cara Sewa</a>
          <a href="#pembayaran" className="text-sm font-medium text-road-900/70 hover:text-road-600">Pembayaran</a>
          <a href="#kontak" className="text-sm font-medium text-road-900/70 hover:text-road-600">Kontak</a>
        </nav>
        <Button size="sm" asChild>
          <a href="#kontak">Sewa Sekarang</a>
        </Button>
      </div>
    </header>
  );
};