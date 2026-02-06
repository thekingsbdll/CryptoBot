import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { key: "clickway" },
    update: {},
    create: {
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
      webhookSecret: "dev-secret",
      formTemplates: {
        create: [
          {
            name: "Brief Automoción",
            vertical: "Automoción (concesionarios)",
            schema: {
              title: "Brief Automoción",
              fields: [
                {
                  id: "currentChannels",
                  label: "Canales actuales",
                  type: "multi",
                  options: ["Meta Ads", "Google Ads", "Portales", "Otros"],
                },
                {
                  id: "crm",
                  label: "CRM actual",
                  type: "select",
                  options: ["Ninguno", "HubSpot", "Pipedrive", "Otro"],
                },
                {
                  id: "stock",
                  label: "Stock medio de vehículos",
                  type: "number",
                },
                {
                  id: "sellTime",
                  label: "Tiempo medio de venta",
                  type: "select",
                  options: ["<30 días", "30-60 días", ">60 días"],
                  condition: { field: "stock", op: ">", value: 20 },
                },
              ],
            },
          },
        ],
      },
    },
  });

  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "owner@clickway.local" },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Owner",
      email: "owner@clickway.local",
      passwordHash,
      role: "OWNER",
    },
  });

  const leadData = [
    {
      fullName: "Pendiente",
      company: "MCM Cars",
      city: "Sabadell",
      source: "meta_lead_ads",
      problem: "Invierto en portales/publicidad pero baja calidad",
      budgetRange: "1000-3000",
      monthlyRevenueRange: "150k+",
    },
    {
      fullName: "Laura Vidal",
      company: "AutoVidal",
      city: "Madrid",
      source: "referido",
      problem: null,
      budgetRange: null,
      monthlyRevenueRange: null,
    },
    {
      fullName: "Pendiente",
      company: "Grupo Motor",
      city: "Valencia",
      source: "web",
      problem: "Leads sin respuesta",
      budgetRange: "500-1000",
      monthlyRevenueRange: null,
    },
  ];

  for (const data of leadData) {
    await prisma.lead.create({
      data: {
        tenantId: tenant.id,
        ...data,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
