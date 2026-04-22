"use server"
import prisma from "@/lib/prisma";
import {generateText, Output} from 'ai'
import {mistral} from '@ai-sdk/mistral'
import {z} from "zod";
import {CategorySuggestion} from "@/types/inventory";

type ActionResult<T> = | { type: "success"; data: T} | { type: "confirm"; message: string} | { type: "error"; message: string}


export async function aiCategories(equipmentName : string) : Promise<ActionResult<CategorySuggestion[]>> {
    const existingCategories = (await prisma.equipmentCategory.findMany()).map(category => category.name);
    const { output } = await generateText({
        model: mistral("mistral-medium-latest"),
        output: Output.object({
            schema:z.object({
                name: z.string(),
                categories: z.array(z.object({
                    name: z.string(),
                    alreadyExists: z.boolean()
                }))
            }),
        }),
        prompt: `
            Your task is to categorize inventory items.
            
            Equipment name: ${equipmentName}
            
            Existing categories: ${JSON.stringify(existingCategories)}
            
            Suggest a list of maximum five most appropriate categories for this item.
            - First look through the provided list of existing categories and find the ones that are the most fitting and add them as a suggestion excaclty as they are written
            - If no fitting categories are found, create suggestions for new categories.
            - If you are not sure that the category is fitting, do not add it as a suggestion and prefer returning an empty list instead of wrong suggestions.
            - If you are not able to find five fitting existing categories you can fill the rest of the list by generating new suggestions
            - Avoid generating suggestions that are just synonyms or alternative ways to write existing categories.
           `
    })

    console.log(output);



     if (output.categories && output.categories.length > 0) {
         return {type: "success", data: output.categories}
     } else {
         return {type: "error", message: "No categories found"}
     }
 }