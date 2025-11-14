import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req : Request) {

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return Response.json({ error: "Missing id" }, { status: 400 });
    }

    const unitId = parseInt(id);

    const unit = await prisma.item.findUnique({
        where: {id: unitId},
        include: {equipment: true}
    });

    if (!unit) {
        return NextResponse.json({success: false, error: "Unit not found"})
    }

    return NextResponse.json(unit.equipment)
}