import type { Lead } from "@prisma/client";

export function generateFollowUp(lead: Lead) {
  const company = lead.company ?? "la empresa";
  const messages = [
    `Hola ${lead.fullName ?? ""}, ¿te viene bien que revisemos los próximos pasos para ${company}?`,
    `Te dejo un resumen rápido de la propuesta. Si encaja, reservamos la segunda llamada.`,
    `¿Tienes 10 minutos esta semana para validar objetivos y presupuesto?`,
  ];

  return { messages };
}
