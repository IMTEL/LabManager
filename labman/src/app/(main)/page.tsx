import prisma from '@/lib/prisma';
import { validateSessionToken} from "@/auth/session";
import { cookies } from "next/headers";
import {redirect} from "next/navigation";

export default async function Inventory() {

    const token = (await cookies()).get("session")?.value;
    const session = token ? await validateSessionToken(token) : null;

    if (!session) {
        redirect("/login");
    }

    const equipment = await prisma.equipment.findMany();

    async function addEquipment(formData : FormData) {
        "use server"
        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const image = formData.get("image") as string;
        const quantity = formData.get("quantity");
        const available = formData.get("available");

        await prisma.equipment.create({
            data: {
                name,
                category,
                image,
                quantity: Number(quantity),
                available: Number(available)
            }
        });

    }
    return (
        <div>
            <h1>{equipment[0].name}</h1>
            <form action={addEquipment}>
                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="category" placeholder="Category" />
                <input type="text" name="image" placeholder="Image" />
                <input type="number" name="quantity" placeholder="Quantity" />
                <input type="number" name="available" placeholder="Available" />
                <button type="submit">Add Equipment</button>

            </form>
        </div>

    );
}