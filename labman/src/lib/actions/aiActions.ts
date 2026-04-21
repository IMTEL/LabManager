"use server"

import prisma from "@/lib/prisma";
import {generateText, Output} from 'ai'
import {mistral} from '@ai-sdk/mistral'
import {z} from "zod";

type ActionResult<T> = | { type: "success"; data: T} | { type: "confirm"; message: string} | { type: "error"; message: string}


// TODO: This should also look through the database for relevant categories instead of always generating new ones
export async function aiCategories(equipmentName : string) : Promise<ActionResult<string[]>> {

    const { output } = await generateText({
        model: mistral("mistral-medium-latest"),
        output: Output.object({
            schema:z.object({
                name: z.string(),
                categories: z.array(z.string())
            }),
        }),
        system: "You are an assistant in a system for managing an inventory of multiple types of equipment, this system is also used to lend the equipment out to borrowers and keep track of status, return dates etc.\n" +
            "\n" +
            "Your task is to find a maximun of five appropiate categories based on the name of the equipment that the user gives you. You will be given the name of an equipment and then you have to find possible categories appropiate for that equipment. In the case that you don't recieve any equipment name from the user leave both equipmentName and categories empty.\n" +
            "\n" +
            "The name of every category should have the first letter capitalized and have spaces between the words.",
        prompt: equipmentName,
    })

    console.log(output);



     if (output.categories && output.categories.length > 0) {
         return {type: "success", data: output.categories}
     } else {
         return {type: "error", message: "No categories found"}
     }
 }

 export async function aiTest(equipmentName : string) {

     const { output } = await generateText({
         model: mistral("mistral-medium-latest"),
         output: Output.object({
             schema:z.object({
                 name: z.string(),
                 categories: z.array(z.string())
             }),
         }),
         system: "You are an assistant in a system for managing an inventory of multiple types of equipment, this system is also used to lend the equipment out to borrowers and keep track of status, return dates etc.\n" +
             "\n" +
             "Your task is to find a maximun of five appropiate categories based on the name of the equipment that the user gives you. You will be given the name of an equipment and then you have to find possible categories appropiate for that equipment. In the case that you don't recieve any equipment name from the user leave both equipmentName and categories empty.\n" +
             "\n" +
             "The name of every category should have the first letter capitalized.",
         prompt: equipmentName,
     })

     console.log(output);
 }