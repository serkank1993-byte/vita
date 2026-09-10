import {
  Home,
  ListChecks,
  ShoppingCart,
  PawPrint,
  Calendar,
  Wallet,
  HeartPulse,
  Package,
  Archive,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Genel Bakış", icon: Home },
  { href: "/dashboard/todos", label: "Yapılacaklar", icon: ListChecks },
  { href: "/dashboard/shopping", label: "Alışveriş Listesi", icon: ShoppingCart },
  { href: "/dashboard/pets", label: "Evcil Hayvanlar", icon: PawPrint },
  { href: "/dashboard/calendar", label: "Takvim", icon: Calendar },
  { href: "/dashboard/finance", label: "Gelir / Gider", icon: Wallet },
  { href: "/dashboard/health", label: "Sağlık Takibi", icon: HeartPulse },
  { href: "/dashboard/inventory", label: "Envanter", icon: Package },
  { href: "/dashboard/archive", label: "Dijital Arşiv", icon: Archive },
  { href: "/dashboard/settings", label: "Ayarlar", icon: Settings },
];
