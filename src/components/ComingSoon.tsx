export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-vita-900">{title}</h1>
      <p className="mt-2 text-vita-600">{description}</p>
      <div className="mt-6 rounded-2xl border border-dashed border-vita-200 bg-white p-6 text-sm text-vita-500">
        Bu modül yakında geliyor. Vita zaman içinde bu alanı da kapsayacak şekilde
        büyüyecek.
      </div>
    </div>
  );
}
