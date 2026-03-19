import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

//TODO: Generally post reguests like this should be done in actions.ts. But there is little point in changing this right now as the backend might be moved later anyways.

export async function POST(req: Request) : Promise<Response> {
    try {
        const body = await req.json();
        const {name, category, image} = body;

        let categoryId = 0;

        let equipmentCategory = await prisma.equipmentCategory.findUnique({
            where: {
                name: category
            }
        })

        // Add equipment category if it doesn't exist'
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

        const existingEquipment = await prisma.equipment.findUnique({where: {name: name}});

        if (existingEquipment) {
            return NextResponse.json(
                { type: "error", message: "Equipment already exists" },
                { status: 409 }
            );
        }

        // Add equipment to the database
        const newEquipment = await prisma.equipment.create({
            data: {
                name,
                image,
                categoryId,
                status: "Active",
                items: {
                    create: {
                        status: "Available"
                    }
                }
            },
            include: {
                category: true,
                items: true
            }
        });


        return NextResponse.json(
            {type: "success", data: newEquipment},
            {status: 201}
        )
    } catch (error) {
        return NextResponse.json(
            {type: "error", message: "An error occurred while adding the equipment"},
            {status: 500}
        )
    }

}