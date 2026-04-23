import { convertToModelMessages, streamText, UIMessage } from "ai";
import { mistral } from "@ai-sdk/mistral";
import prisma from "@/lib/prisma";
import {z} from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model: mistral("mistral-medium"),
        system: `
            You are a helpful assistant for a web application that manages an inventory of equipment.
            Including the borrowing of this equipment to borrowers. You will help the user by summarizing different data related to the inventory
            and doing different tasks based on the users request.
        `,
        messages: await convertToModelMessages(messages),
        tools: {
            getAllEquipment: {
                description: "List the name of all equipment in the inventory",
                inputSchema: z.object({task : z.string()}),
                execute: async ({} : {}) => {
                    const allEquipment = (await prisma.equipment.findMany()).map(equipment => equipment.name);
                    return allEquipment.join(", ");
                }
            }
        }
    });

    console.log(result);

    return result.toUIMessageStreamResponse();
}