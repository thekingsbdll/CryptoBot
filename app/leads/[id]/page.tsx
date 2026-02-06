import { prisma } from "../../../lib/prisma";
import { generateCallPrep } from "../../../lib/generators/callPrep";
import { generateProposal } from "../../../lib/generators/proposal";
import { generateFollowUp } from "../../../lib/generators/followUp";

interface LeadPageProps {
  params: { id: string };
}

export default async function LeadPage({ params }: LeadPageProps) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: { activities: true, tenant: true },
  });

  if (!lead) {
    return <div className="card">Lead no encontrado.</div>;
  }

  const callPrep = generateCallPrep(lead);
  const proposal = generateProposal(lead, lead.tenant);
  const followUp = generateFollowUp(lead);

  return (
    <div className="space-y-6">
      <section className="card space-y-2">
        <h2 className="text-lg font-semibold">Ficha del lead</h2>
        <p>
          <span className="font-medium">Nombre:</span> {lead.fullName ?? "Pendiente"}
        </p>
        <p>
          <span className="font-medium">Empresa:</span> {lead.company ?? "Pendiente"}
        </p>
        <p>
          <span className="font-medium">Ciudad:</span> {lead.city ?? "Pendiente"}
        </p>
        <p>
          <span className="font-medium">Estado:</span> {lead.status}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-600">Preparar primera llamada</h3>
          <p className="mt-2 text-sm text-slate-700">{callPrep.brief}</p>
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-slate-500">Preguntas</h4>
            <ul className="mt-1 list-disc pl-5 text-sm">
              {callPrep.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-600">Propuesta (resumen)</h3>
          <p className="mt-2 text-sm text-slate-700">{proposal.executiveSummary}</p>
          <div className="mt-3 text-xs text-slate-500">
            Confirmado: {proposal.confirmed.length} · Hipótesis: {proposal.hypotheses.length} · Pendiente: {proposal.pending.length}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-600">Actividades</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {lead.activities.map((activity) => (
              <li key={activity.id} className="flex justify-between">
                <span>{activity.type}</span>
                <span className="text-xs text-slate-500">{activity.note ?? "Sin nota"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-600">Mensajes de seguimiento</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {followUp.messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <h3 className="text-sm font-semibold text-slate-600">Acciones rápidas</h3>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a className="rounded bg-indigo-600 px-3 py-2 text-white" href={`/api/leads/${lead.id}/pptx`}>
            Descargar PPTX
          </a>
          <a className="rounded border border-slate-200 px-3 py-2" href={`/api/leads/${lead.id}/call-prep`}>
            Call Prep (JSON)
          </a>
          <a className="rounded border border-slate-200 px-3 py-2" href={`/api/leads/${lead.id}/proposal`}>
            Propuesta (JSON)
          </a>
        </div>
      </section>
    </div>
  );
}
