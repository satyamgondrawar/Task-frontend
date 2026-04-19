import { Menu, Search } from "lucide-react";

function Navbar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-500">
              Productivity Hub
            </p>
            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
            <Search size={16} />
            Smart workflow
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-semibold text-slate-950">
            S
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
