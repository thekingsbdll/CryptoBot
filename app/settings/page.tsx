import { prisma } from "../../lib/prisma";

export default async function SettingsPage() {
  const tenant = await prisma.tenant.findFirst();

  if (!tenant) {
    return <div className="card">No hay tenant configurado.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold">Configuración del cliente</h2>
        <div className="mt-3 grid gap-2 text-sm">
          <p>
            <span className="font-medium">Nombre agencia:</span> {tenant.agencyName}
          </p>
          <p>
            <span className="font-medium">Colores:</span> {tenant.primaryColor} / {tenant.accentColor}
          </p>
          <p>
            <span className="font-medium">Calendario:</span> {tenant.calendarUrl ?? "Pendiente"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {tenant.defaultContactEmail ?? "Pendiente"}
          </p>
          <p>
            <span className="font-medium">Teléfono:</span> {tenant.defaultContactPhone ?? "Pendiente"}
          </p>
        </div>
      </section>
      <section className="card">
        <h3 className="text-sm font-semibold text-slate-600">Webhook</h3>
        <p className="mt-2 text-sm">Secreto activo: {tenant.webhookSecret}</p>
      </section>
    </div>
  );
}
