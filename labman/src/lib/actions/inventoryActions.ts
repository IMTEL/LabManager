"use server"
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {EquipmentWithCategoryAndItems} from "@/types/inventory";

type ActionResult<T> = | { type: "success"; data: T} | { type: "confirm"; message: string} | { type: "error"; message: string}

export async function deleteEquipment(name: string) {
    await prisma.equipment.delete({
        where: {name: name}
    })
    revalidatePath("/");
}

export async function deleteUnit(id: number) {
    await prisma.item.delete({
        where: {id: id}
    })
    revalidatePath("/");
}

export async function addUnit(equipmentName: string) {

    const equipment = await prisma.equipment.findUnique({
        where: {name: equipmentName}
    })

    if (!equipment) {
        alert("Equipment not found");
        return
    }

    const newUnit = await prisma.item.create({
        data: {equipmentId: equipment.id, status: "Available",},
        // TODO: Relational properties always have to be specified or else they will not be included in the response
        include: {loans: true, activeLoan: true}

    })
    revalidatePath("/");
    return newUnit;
}

export async function updateEquipment(equipmentId: number, name: string, category: string, image: string): Promise<ActionResult<EquipmentWithCategoryAndItems>> {

    let categoryId = 0;
    let equipmentCategory = await prisma.equipmentCategory.findUnique({where: {name: category}})

    if (equipmentCategory) {
        categoryId = equipmentCategory.id
    } else {
        equipmentCategory = await prisma.equipmentCategory.create({data: {name: category}})
        categoryId = equipmentCategory.id
    }

    const existingEquipment = await prisma.equipment.findUnique({where: {name: name}})

    if (existingEquipment) {
        return {type: "error", message: "Equipment already exists"}
    }

    const equipment = await prisma.equipment.update({
        where: {id: equipmentId},
        data: {name: name, categoryId: categoryId, image: image},
        include: {
            category: true,
            items: true
        }
    })
    revalidatePath("/");
    return {type: "success", data: equipment};
}