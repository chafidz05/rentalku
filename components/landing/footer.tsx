export function Footer() {
  return (
    <footer className="border-t border-road-100 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-road-600 text-sm">
            🚗
          </span>
          <span className="font-display text-sm font-bold text-road-900">
            RentalKu
          </span>
        </div>
        <p className="text-xs text-road-900/50">
           © {new Date().getFullYear()} RentalKu. Semua hak cipta dilindungi.
        </p>
      </div>
    </footer>
  )
}