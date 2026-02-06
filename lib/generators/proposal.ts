import type { Lead, Tenant } from "@prisma/client";

function statusField(label: string, value: string | null) {
  if (!value) {
    return { label, value: "Pendiente", type: "pending" as const };
  }
  return { label, value, type: "confirmed" as const };
}

export function generateProposal(lead: Lead, tenant: Tenant) {
  const confirmed = [
    statusField("Empresa", lead.company),
    statusField("Ciudad", lead.city),
    statusField("Fuente", lead.source),
  ].filter((item) => item.type === "confirmed");

  const pending = [
    statusField("Problema principal", lead.problem),
    statusField("Presupuesto", lead.budgetRange),
    statusField("Ingresos", lead.monthlyRevenueRange),
  ].filter((item) => item.type === "pending");

  const hypotheses = [
    "Necesitan mejorar la calidad de los leads y el seguimiento comercial.",
    "El CRM actual no está alineado con el proceso de ventas.",
  ];

  const executiveSummary = `Propuesta para ${lead.company ?? "Pendiente"}: foco en generación de leads y sistema comercial con SLA en ${
    tenant.timezone
  }.`;

  const onboardingChecklist = [
    "Acceso a Meta Ads y Business Manager.",
    "Listado de servicios y márgenes reales.",
    "Calendario disponible para llamadas de venta.",
    "Criterios de lead válido y no válido.",
  ];

  const openQuestions = [
    "¿Cuál es el ticket medio real por venta?",
    "¿Qué ratio de conversión actual tenéis en el embudo?",
    "¿Qué recursos internos destináis a ventas?",
  ];

  const sla = {
    firstResponseMinutes: 15,
    attempts: 3,
    followUpDays: 7,
  };

  return {
    executiveSummary,
    confirmed,
    hypotheses,
    pending,
    onboardingChecklist,
    openQuestions,
    sla,
  };
}
