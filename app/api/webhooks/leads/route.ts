import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { rateLimit } from "../../../lib/rateLimit";

const payloadSchema = z.object({
  tenantKey: z.string(),
  source: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  lead: z.object({
    fullName: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    monthlyRevenueRange: z.string().optional().nullable(),
    problem: z.string().optional().nullable(),
    budgetRange: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

function normalizeEmail(email?: string | null) {
  return email ? email.trim().toLowerCase() : null;
}

function normalizePhone(phone?: string | null) {
  return phone ? phone.replace(/\s+/g, "").trim() : null;
}

export async function POST(request: Request) {
  const rate = rateLimit("webhook", 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ ok: false, error: "Rate limit" }, { status: 429 });
  }

  const secret = request.headers.get("x-webhook-secret");
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Missing secret" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const { tenantKey, source, createdAt, lead } = parsed.data;
  const tenant = await prisma.tenant.findUnique({ where: { key: tenantKey } });
  if (!tenant) {
    return NextResponse.json({ ok: false, error: "Tenant not found" }, { status: 404 });
  }

  if (tenant.webhookSecret !== secret) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 403 });
  }

  const newLead = await prisma.lead.create({
    data: {
      tenantId: tenant.id,
      source: source ?? null,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      fullName: lead.fullName ?? null,
      phone: normalizePhone(lead.phone),
      email: normalizeEmail(lead.email),
      company: lead.company ?? null,
      city: lead.city ?? null,
      monthlyRevenueRange: lead.monthlyRevenueRange ?? null,
      problem: lead.problem ?? null,
      budgetRange: lead.budgetRange ?? null,
      notes: lead.notes ?? null,
      status: "NEW",
    },
  });

  return NextResponse.json({ ok: true, leadId: newLead.id });
}
