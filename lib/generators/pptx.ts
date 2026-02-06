import pptxgen from "pptxgenjs";
import type { Lead, Tenant } from "@prisma/client";
import { generateProposal } from "./proposal";

export async function generatePptx(lead: Lead, tenant: Tenant) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = tenant.agencyName;

  const proposal = generateProposal(lead, tenant);
  const titleSlide = pptx.addSlide();
  titleSlide.addText(`${lead.company ?? "Pendiente"}`, {
    x: 0.5,
    y: 1.0,
    w: 12,
    h: 1,
    fontSize: 36,
    color: "1f2937",
  });
  titleSlide.addText("Propuesta comercial", {
    x: 0.5,
    y: 2.0,
    w: 12,
    h: 0.6,
    fontSize: 18,
    color: "6b7280",
  });

  const sections = [
    "Contexto actual",
    "Diagnóstico",
    "Objetivos y KPIs",
    "Estrategia",
    "Funnel",
    "Sistema comercial + SLA",
    "Plan 30/60/90",
    "Inversión",
    "Próximos pasos",
  ];

  sections.forEach((title, index) => {
    const slide = pptx.addSlide();
    slide.addText(title, {
      x: 0.5,
      y: 0.5,
      w: 12,
      h: 0.6,
      fontSize: 26,
      color: "111827",
    });
    const body =
      index === 0
        ? proposal.confirmed.map((item) => `${item.label}: ${item.value}`).join("\n") ||
          "Pendiente"
        : index === 1
          ? proposal.hypotheses.join("\n")
          : index === 7
            ? "Packs estándar y propuesta personalizada disponibles."
            : "Pendiente";
    slide.addText(body, {
      x: 0.8,
      y: 1.5,
      w: 11.2,
      h: 4,
      fontSize: 16,
      color: "374151",
    });
  });

  const arrayBuffer = await pptx.write("arraybuffer");
  return Buffer.from(arrayBuffer);
}
