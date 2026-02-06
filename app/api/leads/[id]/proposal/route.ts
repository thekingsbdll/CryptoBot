import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { generateProposal } from "../../../../../lib/generators/proposal";
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

  return NextResponse.json({
    ok: true,
    data: generateProposal(lead, lead.tenant),
  });
}
