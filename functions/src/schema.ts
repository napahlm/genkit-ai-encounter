import { z } from "genkit";

export const responseSchema = z.object({
    elaborate: z.boolean().describe(""),
    summary: z.string().describe("Summary of the battle's state and surroundings."),
    //hitPoints: z.number().int().describe("The player's hit points (Required, non-negative)"),
    //damage: z.number().int().int().describe("The player's damage (Required, non-negative)")
})