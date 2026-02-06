import { prisma } from "./prisma";
import { formatInTimeZone } from "date-fns-tz";

const DEFAULT_TENANT_KEY = process.env.DEFAULT_TENANT_KEY ?? "clickway";

export async function getLeadsForDashboard() {
  const tenant = await prisma.tenant.findUnique({
    where: { key: DEFAULT_TENANT_KEY },
  });

  if (!tenant) {
    return { todayLeads: [], unattendedLeads: [], funnel: [] };
  }

  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const todayLeads = await prisma.lead.findMany({
    where: {
      tenantId: tenant.id,
      createdAt: { gte: todayStart },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const unattendedLeads = await prisma.lead.findMany({
    where: {
      tenantId: tenant.id,
      status: "NEW",
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const statuses = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "PROPOSAL",
    "NEGOTIATION",
    "WON",
    "LOST",
  ] as const;

  const funnel = await Promise.all(
    statuses.map(async (status) => {
      const count = await prisma.lead.count({
        where: { tenantId: tenant.id, status },
      });
      return { status, count };
    })
  );

  return {
    todayLeads,
    unattendedLeads: unattendedLeads.map((lead) => ({
      ...lead,
      nextActionAt: lead.nextActionAt
        ? formatInTimeZone(lead.nextActionAt, "Europe/Madrid", "dd/MM HH:mm")
        : null,
    })),
    funnel,
  };
}
