import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    const { name, category, image } = body;

    let categoryId = 0;

    let equipmentCategory = await prisma.equipmentCategory.findUnique({
        where: {
            name: category
        }
    })

    if (equipmentCategory) {
        console.log("Category exists");
        categoryId = equipmentCategory.id;
    } else {
        console.log("Category does not exist");
        equipmentCategory = await prisma.equipmentCategory.create({
            data: {
                name: category
            }
        })
        categoryId = equipmentCategory.id;
    }


   const newEquipment = await prisma.equipment.create({
        data: {
            name,
            image,
            categoryId
        },
        include: {category: true}
    });



    return NextResponse.json(newEquipment);

}