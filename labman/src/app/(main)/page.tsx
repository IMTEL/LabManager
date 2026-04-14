import {mistralClient} from "@/lib/mistral";

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

  /*  const messages = [
        {"role":"user" as const, "content":"metaquest3"}
    ];

    const response = await mistralClient.beta.conversations.start({
        agentId: 'ag_019d8b49ddbc7315bcc88f9d3df3cfed',
        agentVersion: 5,
        inputs: messages
    })

    console.log(response);
    console.log(response.outputs) */

    return (
        <div className="">
            <div className="ml-20 mr-20">
                <EquipmentClient equipmentList={equipmentList} />
            </div>

        </div>

    );
}