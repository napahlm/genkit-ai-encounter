/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//import { onRequest } from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import "dotenv/config"; // for local testing
//import { onCallGenkit } from "firebase-functions/https";

import { genkit, z } from "genkit";
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import {
  analyzeAction,
  elaborateEncounter,
  summarizeTurn,
  greeterCallable,
  generateEncounterCallable,
} from "./flows";
import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

const performActionSchema = z.object({
  turn: z.number().int().describe("The current battle turn number."),
  playerHp: z.number().int().describe("The player's max hitpoints."),
  playerCurrentHp: z.number().int().describe("The player's current hitpoints."),
  playerDmg: z.number().int().describe("The player's attack damage."),
  enemyHp: z.number().int().describe("The enemy's max hitpoints."),
  enemyCurrentHp: z.number().int().describe("The enemy's current hitpoints."),
  enemyDmg: z.number().int().describe("The enemy's attack damage."),
  lastAction: z
    .string()
    .describe("The player's last action input prompt summarized."),
  lastNarrative: z
    .string()
    .describe("The narrative summary from the last turn."),
  fullNarrative: z.string().describe("The accumulated narrative so far."),
  playerWon: z.boolean().describe("Flag indicating if the player has won."),
  enemyWon: z.boolean().describe("Flag indicating if the enemy has won."),
  elaborate: z.boolean().describe("Flag indicating if elaboration is needed."),
});

export const performAction = ai.defineFlow(
  {
    name: "performAction",
    inputSchema: performActionSchema,
    outputSchema: performActionSchema,
  },
  async (action) => {
    const analysis = await analyzeAction(action.lastAction);
    let narrativeUpdate: string = "";

    // only do elaboration
    if (analysis.elaborate == true) {
      // expand on the battle encounter given what the player asks for
      const elaborationInquiry = {
        fullNarrative: action.fullNarrative,
        actionSummary: analysis.summary,
      };
      narrativeUpdate = await elaborateEncounter(elaborationInquiry);
    }

    // simulate attack turns
    else {
      // perform turn
      action.turn += 1;
      // 1. player turn
      action.enemyCurrentHp -= Math.floor(Math.random() * action.playerDmg + 1);
      // if enemy is dead, skip enemy turn and set playerWon = true
      if (action.enemyCurrentHp <= 0) {
        action.playerWon = true;
      }
      // 2. enemy turn
      else {
        action.playerCurrentHp -= Math.floor(
          Math.random() * action.enemyDmg + 1
        );
      }
      // if player is dead, set enemyWon = true
      if (action.playerCurrentHp <= 0) {
        action.enemyWon = true;
      }
      // 3. summarize turn, and return summary and character stats
      const summarizeTurnInput = {
        playerHp: action.playerCurrentHp,
        enemyHp: action.enemyCurrentHp,
        playerWon: action.playerWon,
        enemyWon: action.enemyWon,
        lastNarrative: action.lastNarrative,
        fullNarrative: action.fullNarrative,
      };

      // Call summarizeTurn with the tailored input
      const summaryResult = await summarizeTurn(summarizeTurnInput);
      narrativeUpdate = summaryResult.summary;
    }

    if (analysis.elaborate == true) {
      // Add narrative update to full narrative
      action.fullNarrative += " Elaboration: " + narrativeUpdate;
    } else {
      // Add the increased turn inbetween narrative and last update
      action.fullNarrative += " Turn " + action.turn + ": " + narrativeUpdate;
    }

    return {
      turn: action.turn,
      playerHp: action.playerHp, // pass-through
      playerCurrentHp: action.playerCurrentHp,
      playerDmg: action.playerDmg,
      enemyHp: action.enemyHp, // pass-through
      enemyCurrentHp: action.enemyCurrentHp,
      enemyDmg: action.enemyDmg,
      lastAction: action.lastAction,
      lastNarrative: narrativeUpdate,
      fullNarrative: action.fullNarrative,
      playerWon: action.playerWon,
      enemyWon: action.enemyWon,
      elaborate: analysis.elaborate,
    };
  }
);

const performActionCallable = onCallGenkit(
  {
    secrets: [apiKey],
  },
  performAction
);

/// Exported secondary callable genkit flows
export { greeterCallable, generateEncounterCallable, performActionCallable };
