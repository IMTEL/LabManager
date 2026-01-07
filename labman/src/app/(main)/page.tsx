export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { validateSessionToken} from "@/auth/session";
import { cookies } from "next/headers";
import {redirect} from "next/navigation";
import EquipmentClient from "@/components/inventory/EquipmentClient";

export default async function Inventory() {

    const token = (await cookies()).get("session")?.value;
    const session = token ? await validateSessionToken(token) : null;

    if (!session) {
        redirect("/login");
    }

    const equipmentList = await prisma.equipment.findMany({
        include: {
            category: true,
            items: {
                include: {
                    loans: true,
                    activeLoan: true
                }
            }
        }
    });

    return (
        <div className="">
            <div className="ml-20 mr-20">
                <EquipmentClient equipmentList={equipmentList} />
            </div>

        </div>

    );
}