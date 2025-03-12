//import {onRequest} from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";

import { genkit, z } from "genkit";
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { responseSchema } from "./schema";

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

ai.defineFlow(
    {
        name: "encounter",
        inputSchema: z.string(),
        outputSchema: responseSchema.nullish()
    },
    async (prompt) => {
        const { output } = await ai.generate({
            prompt: `
            You are a DnD dungeon master overseeing a battle turn between the player and an enemy goblin.
            The player's prompt is: "${prompt}"
            Analyze the player's prompt and determine whether the player is asking for a more detailed, descriptive narration or is ready to take an action like attacking.
            If the prompt indicates a request for more detailed description (for example, using words like "describe", "elaborate", or "explain"), or asking questions, set "elaborate" to true.
            If the prompt indicates the player is ready to perform an action (like "attack", "strike", "reposition" etc.), set "elaborate" to false.
            Return a valid JSON object in the following format:
            {
              "elaborate": boolean,  // true if elaboration is requested, false otherwise
              "summary": string      // a brief summary of the battle state and surroundings
            }
          `,
            output: { schema: responseSchema }
        });
        return output;
    }
)