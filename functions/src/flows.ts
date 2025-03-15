import { onCallGenkit } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { genkit, z } from "genkit";
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";

import "dotenv/config"; // for local testing

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

// ----------------------------
// Analyze Initial Prompt
// ----------------------------

const elaborationSchema = z.object({
  elaborate: z
    .boolean()
    .describe(
      "True if the player asks for more details or elaboration, false otherwise."
    ),
  summary: z
    .string()
    .describe("Brief summary of the player's intended action."),
});

export const analyzeAction = ai.defineFlow(
  {
    name: "analyzeAction",
    inputSchema: z.string(),
  },
  async (actionText) => {
    const { output } = await ai.generate({
      prompt: `
            You are a DnD dungeon master overseeing a battle turn between
            the player, which is a human, and a goblin, which is an AI model.
            You are to decide whether the player's input indicates that they
            want to perform an action which would result in an attacking dice
            roll, or if they are asking for elaboration of the battle scenario.

            The player's prompt is the following:
            "${actionText}"

            Analyze the prompt in the eyes of a dungeon master.
            If the prompt is asking for a more detailed description (for example,
            using words like "elaborate", "describe", "explain", or if they are
            asking a question), set the parameter "elaborate" to true.
            
            If the prompt indicates that the player is ready to perform an action
            (like "attack", "strike", "throw", or any action that could damage the
            enemy) set "elaborate" to false.

            In addition to the elaboration boolean, create a storytelling summary
            of what the player indicates that they want to do given the situation.

            Return a valid JSON object in the following format:
            {
                "elaborate": boolean, // true if elaboration is requested, false otherwise
            }
            `,
      output: { schema: elaborationSchema },
    });
    return output;
  }
);

// ----------------------------
// Greeter Flow (Placeholder for attack turn)
// ----------------------------

const greetingSchema = z.object({
  greeting: z.string().describe("A jolly good greeting!"),
});

export const greeter = ai.defineFlow(
  {
    name: "greeter",
  },
  async () => {
    const { output } = await ai.generate({
      prompt: `Return a funny greeting!`,
      output: { schema: greetingSchema },
    });
    return output?.greeting;
  }
);

export const greeterCallable = onCallGenkit(
  {
    secrets: [apiKey],
  },
  greeter
);

// ----------------------------
// Elaborate Encounter Flow
// ----------------------------

const elaborateEncounterInputSchema = z.object({
  fullNarrative: z.string().describe("Full narrative of the encounter so far."),
  actionSummary: z
    .string()
    .describe(
      "Summary of action intended by player categorized as an elaboration inquiry."
    ),
});

const elaborateEncounterOutputSchema = z.object({
  elaboration: z
    .string()
    .describe(
      "Concise and brief elaboration of the player's inquiry about the battle scene."
    ),
});

export const elaborateEncounter = ai.defineFlow(
  {
    name: "elaborateEncounter",
    inputSchema: elaborateEncounterInputSchema,
  },
  async (narrative) => {
    const prompt = `
        The battle is ongoing, but the player has asked for elaboration.
        No turns are taken and you are an expert Dungeon Master expanding on
        the current battle encounter answering the player's inquires.

        The full narrative of the battle up until now is the following: "${narrative.fullNarrative}".
        
        The player then said this: "${narrative.actionSummary}".

        Please elaborate on the battle scene in detail.
      `;
    const { output } = await ai.generate({
      prompt,
      output: { schema: elaborateEncounterOutputSchema },
    });
    return output?.elaboration;
  }
);

// ----------------------------
// Generate Encounter
// ----------------------------

const encounterSchema = z.object({
  playerHp: z.number().int().describe("The player's hitpoints."),
  playerDmg: z.number().int().describe("The player's attack damage."),
  enemyHp: z.number().int().describe("The enemy's hitpoints."),
  enemyDmg: z.number().int().describe("The enemy's attack damage."),
  lastNarrative: z
    .string()
    .describe("A brief, engaging narrative describing the encounter."),
});

export const generateEncounter = ai.defineFlow(
  {
    name: "generateEncounter",
  },
  async (summary: string) => {
    const prompt = `
      You are a creative and dynamic Dungeon Master. Your task is to generate a unique and engaging
      battle encounter between a heroic player and a formidable enemy, in the style of Dungeons & Dragons.
      The battle should be designed to last up to around 10 turns.

      Provide both a vivid narrative description and realistic numerical values that can be used in game mechanics.
      Consider using balanced, game-ready numbers(for example, player hitpoints might be between 50 and 120,
      player damage between 5 and 20, enemy hitpoints between 40 and 100, and enemy damage between 5 and 20).

      The narrative should set the scene succinctly and hint at the dynamic nature of the combat, without excessive detail.

      Output a valid JSON object exactly matching this schema:
      
      {
        "playerHp": <integer>,
        "playerDmg": <integer>,
        "enemyHp": <integer>,
        "enemyDmg": <integer>,
        "lastNarrative": "<brief description>"
      }
      
      Do not include any additional text or explanation.
    `;
    const { output } = await ai.generate({
      prompt,
      output: { schema: encounterSchema },
    });
    return output;
  }
);

export const generateEncounterCallable = onCallGenkit(
  {
    secrets: [apiKey],
  },
  generateEncounter
);

// ----------------------------
// Summarize Battle Turn
// ----------------------------

const summarizeTurnInputSchema = z.object({
  playerHp: z.number().int().describe("The player's hitpoints after the turn."),
  enemyHp: z.number().int().describe("The enemy's hitpoints after the turn."),
  playerWon: z.boolean().describe("True if the player has defeated the enemy."),
  enemyWon: z.boolean().describe("True if the enemy has defeated the player."),
  lastNarrative: z.string().describe("The narrative from the previous turn."),
  fullNarrative: z
    .string()
    .describe("The full narrative accumulated until now."),
});

const summarizeTurnOutputSchema = z.object({
  summary: z
    .string()
    .describe("A narrative update describing how the turn went."),
});

export const summarizeTurn = ai.defineFlow(
  {
    name: "summarizeTurn",
    inputSchema: summarizeTurnInputSchema,
    outputSchema: summarizeTurnOutputSchema,
  },
  async (state) => {
    const outcome = state.playerWon
      ? "player victory"
      : state.enemyWon
      ? "enemy victory"
      : "ongoing battle";

    const prompt = `
      You are a creative and dynamic Dungeon Master. Based on the encounter details below, generate a vivid and tailored narrative update describing how the turn unfolded:

      - Player Hitpoints: ${state.playerHp}
      - Enemy Hitpoints: ${state.enemyHp}
      - Outcome: ${outcome} (playerWon: ${state.playerWon}, enemyWon: ${state.enemyWon})
      - Previous Turn Narrative: ${state.lastNarrative}
      - Full Narrative So Far: ${state.fullNarrative}

      Ensure that your summary is concise yet engaging, capturing unique details about the enemy type, player class, and battle strategies. 
      
      If both combatants are still in the fight, highlight the tension and the continued exchange of blows. If the player has emerged victorious, emphasize the heroic triumph. If the enemy has won, portray the crushing defeat in a dramatic fashion.
      
      Output only a valid JSON object in the following format:
      {
        "summary": "<your narrative update>"
      }
      
      Do not include any additional commentary.
    `;

    const { output } = await ai.generate({
      prompt,
      output: { schema: summarizeTurnOutputSchema },
    });

    // Ensure that we always return a valid object with a summary.
    if (!output) {
      return {
        summary:
          "The turn concludes in silence, leaving an unsettling calm on the battlefield.",
      };
    }

    return output;
  }
);
