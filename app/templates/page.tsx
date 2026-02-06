import { prisma } from "../../lib/prisma";

export default async function TemplatesPage() {
  const templates = await prisma.formTemplate.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold">Formularios por vertical</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {templates.map((template) => (
            <li key={template.id} className="flex justify-between">
              <span>{template.name}</span>
              <span className="text-xs text-slate-500">{template.vertical}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
