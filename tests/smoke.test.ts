import { describe, it, expect } from "vitest";
import { generateCallPrep } from "../lib/generators/callPrep";
import { generateProposal } from "../lib/generators/proposal";
import { generateFollowUp } from "../lib/generators/followUp";
import { generatePptx } from "../lib/generators/pptx";

const lead = {
  id: "lead-1",
  tenantId: "tenant-1",
  source: "meta_lead_ads",
  createdAt: new Date(),
  updatedAt: new Date(),
  fullName: "Benito Cabrera",
  phone: "+34XXXXXXXXX",
  email: "benitocabrerag@gmail.com",
  company: "MCM Cars",
  city: "Sabadell",
  monthlyRevenueRange: "150k+",
  problem: "Invierto en portales/publicidad pero baja calidad",
  budgetRange: "1000-3000",
  notes: "Lead frío",
  status: "NEW",
  nextActionAt: null,
} as const;

const tenant = {
  id: "tenant-1",
  key: "clickway",
  agencyName: "ClickWay Marketing",
  primaryColor: "#0B1220",
  accentColor: "#D4AF37",
  logoUrl: null,
  calendarUrl: null,
  defaultContactPhone: null,
  defaultContactEmail: null,
  timezone: "Europe/Madrid",
  locale: "es-ES",
  webhookSecret: "secret",
  createdAt: new Date(),
  updatedAt: new Date(),
} as const;

describe("smoke generators", () => {
  it("generates call prep", () => {
    const callPrep = generateCallPrep(lead);
    expect(callPrep.questions.length).toBeGreaterThan(5);
  });

  it("generates proposal", () => {
    const proposal = generateProposal(lead, tenant);
    expect(proposal.executiveSummary).toContain("MCM Cars");
  });

  it("generates follow-up", () => {
    const followUp = generateFollowUp(lead);
    expect(followUp.messages.length).toBeGreaterThan(1);
  });

  it("generates pptx", async () => {
    const pptx = await generatePptx(lead, tenant);
    expect(pptx.byteLength).toBeGreaterThan(1000);
  });
});
