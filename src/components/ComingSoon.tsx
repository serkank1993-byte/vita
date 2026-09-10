import { PageHeader } from "./PageHeader";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-xl">
      <PageHeader title={title} description={description} />
      <div className="rounded-2xl border border-dashed border-vita-200 bg-white p-6 text-sm text-vita-500">
        Bu modül yakında geliyor. Vita zaman içinde bu alanı da kapsayacak şekilde
        büyüyecek.
      </div>
    </div>
  );
}
