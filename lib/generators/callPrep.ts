import type { Lead } from "@prisma/client";

export function generateCallPrep(lead: Lead) {
  const brief = `Lead ${lead.fullName ?? "Pendiente"} (${lead.company ?? "Pendiente"}) ha llegado desde ${
    lead.source ?? "Pendiente"
  }. Objetivo: validar encaje y acordar próximos pasos sin prometer resultados.`;

  const questions = [
    "¿Qué objetivo principal queréis conseguir en los próximos 90 días?",
    "¿Qué canales habéis probado y qué resultados os han dado?",
    "¿Qué os frena ahora mismo para captar leads de calidad?",
    "¿Cómo gestionáis los leads cuando entran?",
    "¿Cuál es vuestro ticket medio y margen aproximado?",
    "¿Qué equipo interno participa en marketing y ventas?",
    "¿Tenéis CRM o sistema de seguimiento?",
    "¿Qué parte del proceso queréis delegar y qué parte mantener interna?",
    "¿Qué presupuesto mensual podéis sostener sin tensión?",
    "¿Cuál sería un primer resultado que consideraríais éxito?",
  ];

  const objections = [
    "No tenemos presupuesto claro.",
    "Ya trabajamos con otra agencia.",
    "Nos preocupa la calidad de los leads.",
  ];

  const responses = [
    "Podemos empezar con un plan mínimo y validar calidad en 30 días.",
    "Podemos coordinar el trabajo sin duplicar esfuerzos y medir resultados reales.",
    "Definimos un SLA comercial y criterios de lead para filtrar desde el primer día.",
  ];

  const closing = {
    nextCall: "Si encaja, fijamos una segunda llamada con objetivos y métricas.",
    dataForm: "Si falta información, enviamos un formulario corto para completar datos.",
  };

  return { brief, questions, objections, responses, closing };
}
