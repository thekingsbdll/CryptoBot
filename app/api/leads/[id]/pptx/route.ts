import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { generatePptx } from "../../../../../lib/generators/pptx";
import { requireSession } from "../../../../../lib/apiAuth";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const lead = await prisma.lead.findFirst({
    where: { id: params.id, tenantId: session.user.tenantId },
    include: { tenant: true },
  });

  if (!lead) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const pptxBuffer = await generatePptx(lead, lead.tenant);
  return new NextResponse(pptxBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename=propuesta-${lead.id}.pptx`,
    },
  });
}
