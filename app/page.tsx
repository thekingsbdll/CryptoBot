import { getLeadsForDashboard } from "../lib/data";

export default async function DashboardPage() {
  const { todayLeads, unattendedLeads, funnel } = await getLeadsForDashboard();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-600">Leads de hoy</h2>
          <p className="mt-2 text-3xl font-semibold">{todayLeads.length}</p>
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-600">
            Leads sin contactar
          </h2>
          <p className="mt-2 text-3xl font-semibold">{unattendedLeads.length}</p>
          <p className="text-xs text-slate-500">
            Revisa tiempos de respuesta para mantener el SLA.
          </p>
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-600">Embudo</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {funnel.map((stage) => (
              <li key={stage.status} className="flex justify-between">
                <span>{stage.status}</span>
                <span className="font-semibold">{stage.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-600">Leads de hoy</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {todayLeads.map((lead) => (
              <li key={lead.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{lead.fullName ?? "Pendiente"}</p>
                  <p className="text-xs text-slate-500">
                    {lead.company ?? "Pendiente"}
                  </p>
                </div>
                <a className="text-indigo-600" href={`/leads/${lead.id}`}>
                  Ver ficha
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-600">
            Leads sin contactar
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            {unattendedLeads.map((lead) => (
              <li key={lead.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{lead.fullName ?? "Pendiente"}</p>
                  <p className="text-xs text-slate-500">
                    {lead.nextActionAt
                      ? `Próxima acción: ${lead.nextActionAt}`
                      : "Sin próxima acción"}
                  </p>
                </div>
                <a className="text-indigo-600" href={`/leads/${lead.id}`}>
                  Ver ficha
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
