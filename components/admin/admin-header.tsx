import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";

export function AdminHeader({ active }: { active: "peminjam" | "mobil" }) {
  return (
    <header className="border-b border-road-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-road-600 text-lg">
            🚗
          </span>
          <div>
            <p className="font-display text-sm font-extrabold text-road-900">
              RentalKu - Admin
            </p>
            <p className="text-xs text-road-900/50">Panel Pengelolaan</p>
          </div>
        </div>
        <LogoutButton />
      </div>
      <nav className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
        <Link
          href="/admin"
          className={`border-b-2 px-3 py-2.5 text-sm font-semibold ${
            active === "peminjam"
              ? "border-road-600 text-road-600"
              : "border-transparent text-road-900/60 hover:text-road-900"
          }`}
        >
          Peminjam
        </Link>
        <Link
          href="/admin/mobil"
          className={`border-b-2 px-3 py-2.5 text-sm font-semibold ${
            active === "mobil"
              ? "border-road-600 text-road-600"
              : "border-transparent text-road-900/600 hover:text-road-900"
          }`}
        >
          Mobil
        </Link>
      </nav>
    </header>
  );
};