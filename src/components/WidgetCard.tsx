import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function WidgetCard({
  title,
  icon: Icon,
  href,
  children,
}: {
  title: string;
  icon: LucideIcon;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-vita-100 bg-white p-4 transition hover:border-vita-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-vita-700">
        <Icon size={18} className="text-vita-500" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </Link>
  );
}
