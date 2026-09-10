"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { navItems } from "@/lib/nav-items";
import { logout } from "./actions";

function isActivePath(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="mt-6 flex-1 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active ? "bg-vita-600 text-white" : "text-vita-800 hover:bg-vita-50"
            }`}
          >
            <Icon size={18} className={active ? "text-white" : "text-vita-400"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-vita-500 hover:bg-vita-50"
      >
        <LogOut size={16} />
        Çıkış yap
      </button>
    </form>
  );
}

export function Sidebar({
  familyName,
  inviteCode,
}: {
  familyName: string;
  inviteCode: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center justify-between border-b border-vita-100 bg-white px-4 py-3 md:hidden">
        <div>
          <p className="text-lg font-semibold text-vita-900">Vita</p>
          <p className="text-xs text-vita-500">{familyName}</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-vita-700 hover:bg-vita-50"
          aria-label="Menüyü aç"
        >
          <Menu size={22} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white px-4 py-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-vita-900">Vita</p>
                <p className="mt-1 text-sm text-vita-600">{familyName}</p>
                <p className="mt-1 text-xs text-vita-400">Davet kodu: {inviteCode}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-vita-500 hover:bg-vita-50"
                aria-label="Menüyü kapat"
              >
                <X size={20} />
              </button>
            </div>
            <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
            <LogoutButton />
          </div>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-vita-100 bg-white px-4 py-6 md:flex">
        <div>
          <p className="text-lg font-semibold text-vita-900">Vita</p>
          <p className="mt-1 truncate text-sm text-vita-600">{familyName}</p>
          <p className="mt-1 text-xs text-vita-400">Davet kodu: {inviteCode}</p>
        </div>
        <NavList pathname={pathname} />
        <LogoutButton />
      </aside>
    </>
  );
}
