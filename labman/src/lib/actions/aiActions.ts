"use server"

import {mistralClient} from "@/lib/mistral";

type ActionResult<T> = | { type: "success"; data: T} | { type: "confirm"; message: string} | { type: "error"; message: string}

export async function aiCategories(equipmentName : string) {
     const messages = [
     {"role":"user" as const, "content":equipmentName}];

     const response = await mistralClient.beta.conversations.start({
         agentId: 'ag_019d8b49ddbc7315bcc88f9d3df3cfed',
         agentVersion: 5,
         inputs: messages
     })

     console.log(response);
     console.log(response.outputs)
 }