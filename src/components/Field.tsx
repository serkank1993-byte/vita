export function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium text-vita-500">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-vita-200 px-3 py-2 text-sm text-vita-900 outline-none focus:border-vita-500 focus:ring-1 focus:ring-vita-500";
