"use server"

import {mistralClient} from "@/lib/mistral";
import {MessageOutputEntry} from "@mistralai/mistralai/models/components";

type ActionResult<T> = | { type: "success"; data: T} | { type: "confirm"; message: string} | { type: "error"; message: string}

interface Response {
    categories: string[],
    equipmentName : string
}

// TODO: This should also look through the database for relevant categories instead of always generating new ones
export async function aiCategories(equipmentName : string) : Promise<ActionResult<string[]>> {
     const messages = [
     {"role":"user" as const, "content":equipmentName}];

     const response = await mistralClient.beta.conversations.start({
         agentId: 'ag_019d8b49ddbc7315bcc88f9d3df3cfed',
         agentVersion: 9,
         inputs: messages
     })

    const outputs = response.outputs as MessageOutputEntry[]
    const output = JSON.parse(outputs[0].content as string) as Response

     console.log(response);
     console.log(output);
     console.log(output.categories);

     if (output.categories && output.categories.length > 0) {
         return {type: "success", data: output.categories}
     } else {
         return {type: "error", message: "No categories found"}
     }
 }