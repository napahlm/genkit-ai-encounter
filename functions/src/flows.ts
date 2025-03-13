import { genkit, z } from "genkit";
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";

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
  summary: z.string().describe("Brief summary of the player's intended action."),
});

export const analyzePrompt = ai.defineFlow(
  {
    name: "analyzeFlow",
  },
  async (rawPrompt) => {
    const { output } = await ai.generate({
      prompt: `
            You are a DnD dungeon master overseeing a battle turn between
            the player, which is a human, and a goblin, which is an AI model.
            You are to decide whether the player's input indicates that they
            want to perform an action which would result in an attacking dice
            roll, or if they are asking for elaboration of the battle scenario.

            The player's prompt is the following:
            "${rawPrompt}"

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

// ----------------------------
// Elaborate Encounter Flow
// ----------------------------

const elaborateEncounterSchema = z.object({
  elaboration: z.string().describe("Concise elaboration of the battle scene"),
});

export const elaborateEncounter = ai.defineFlow(
  {
    name: "elaborateEncounter",
  },
  async (summary: string) => {
    const prompt = `
        The battle is ongoing, but the player has asked for elaboration.
        No turns are taken and you are an expert Dungeon Master expanding on
        the current battle encounter answering the player's inquires.
        
        The player said: "${summary}"

        Please elaborate on the battle scene in detail.
      `;
    const { output } = await ai.generate({
      prompt,
      output: { schema: elaborateEncounterSchema },
    });
    return output?.elaboration;
  }
);
