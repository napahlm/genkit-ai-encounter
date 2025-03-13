//import {onRequest} from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";
import 'dotenv/config';

import { genkit, z } from "genkit";
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { analyzePrompt, elaborateEncounter, greeter } from "./flows";

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

ai.defineFlow(
    {
        name: "encounter",
        inputSchema: z.string(), // Incoming prompt from user
        outputSchema: z.object({ elaborate: z.boolean(), result: z.string(), }),
    },
    async (rawPrompt) => {
      const analysis = await analyzePrompt(rawPrompt);
      let result: string = "";

      // only do elaboration
      if (analysis.elaborate == true)
      {
        // expand on the battle encounter given what the player asks for
        result = await elaborateEncounter(analysis.summary);
      }
      
      // simulate attack turns
      else
      {
        // perform turn
        // 1. player turn
        // if enemy is dead, skip enemy turn and set win = true
        // 2. enemy turn
        // if player is dead, set lose = true
        // 3. summarize turn, and return summary and character stats

        // placeholder
        result = await greeter();
      }

      
      return {
        elaborate: analysis.elaborate,
        result: result,
      }
    }
);