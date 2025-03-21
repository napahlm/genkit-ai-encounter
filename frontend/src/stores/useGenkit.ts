import { defineStore } from "pinia";
import { ref } from "vue";
import { genkitGenerateEncounter, genkitPerformAction } from "@/firebase";

// Existing minimal response interface from the encounter generation.
interface EncounterResponse {
  lastNarrative: string;
  playerHp: number;
  playerDmg: number;
  enemyHp: number;
  enemyDmg: number;
  [key: string]: any;
}

// Define a full interface matching your performActionSchema.
interface PerformActionState {
  turn: number;
  playerCurrentHp: number;
  playerDmg: number;
  enemyCurrentHp: number;
  enemyDmg: number;
  lastAction: string;
  lastNarrative: string;
  fullNarrative: string;
  playerWon: boolean;
  enemyWon: boolean;
  elaborate: boolean;
}

export const useGenkitStore = defineStore("genkit", () => {
  // state
  const response = ref<string | undefined>(undefined); // test
  const encounter = ref<PerformActionState | null>(null);
  const gameActive = ref(false);
  const chatHistory = ref(<any[]>[]);
  const generateLoading = ref(false);
  const actionLoading = ref(false);

  // action
  function $reset() {
    response.value = "";
    encounter.value = null; // main battle state
    gameActive.value = false;
    chatHistory.value = [];
  }

  async function generateEncounter() {
    try {
      $reset();
      generateLoading.value = true;
      const { data } = await genkitGenerateEncounter();
      console.log("Encounter state:", data);
      const encounterData = data as EncounterResponse;
      encounter.value = {
        ...encounterData,
        // playerHp
        // playerDmg
        // enemyHp
        // enemyDmg
        // lastNarrative
        turn: 0,
        playerCurrentHp: encounterData.playerHp,
        enemyCurrentHp: encounterData.enemyHp,
        playerWon: false,
        enemyWon: false,
        lastAction: "Initiated encounter.",
        fullNarrative: "Initial encounter: " + encounterData.lastNarrative,
        elaborate: false,
      };

      gameActive.value = true;
      generateLoading.value = false;

      await streamMessage(`${encounterData.lastNarrative}`);

    } catch (error) {
      console.error("Failed to generate encounter:", error);
    } finally {
      generateLoading.value = false;
    }
  }

  async function performAction(action: string) {
    try {
      if (!encounter.value) {
        throw new Error("No encounter has been generated.");
      }

      actionLoading.value = true;

      chatHistory.value.push({ text: `${action}`, sender: "player" });

      encounter.value.lastAction = action;

      const { data } = await genkitPerformAction(encounter.value);
      const result = data as PerformActionState;

      // Update the encounter state with the response data.
      encounter.value.turn = result.turn;
      encounter.value.playerCurrentHp = result.playerCurrentHp;
      //encounter.value.playerDmg = result.playerDmg;
      encounter.value.enemyCurrentHp = result.enemyCurrentHp;
      //encounter.value.enemyDmg = result.enemyDmg;
      //encounter.value.lastAction = result.lastAction;
      encounter.value.lastNarrative = result.lastNarrative;
      encounter.value.fullNarrative = result.fullNarrative;
      encounter.value.playerWon = result.playerWon;
      encounter.value.enemyWon = result.enemyWon;
      encounter.value.elaborate = result.elaborate;

      if (result.playerWon || result.enemyWon) {
        gameActive.value = false;
      }
      
      actionLoading.value = false;
      let responsePrefix = result.elaborate ? "🔍" : "⚔️";
      await streamMessage(`${responsePrefix} ${result.lastNarrative}`);

      console.log("Encounter action result:", data);
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      actionLoading.value = false;
    }
  }

  async function streamMessage(message: string): Promise<void> {
    return new Promise<void>((resolve) => {
      
      const words = message.split(" ");
      let streamedText = "";
      let messageIndex = chatHistory.value.length;

      // Add an empty AI message to be updated in real time
      chatHistory.value.push({ text: "", sender: "ai" });

      function addNextWord(index: number) {
        if (index < words.length) {
          streamedText += (index === 0 ? "" : " ") + words[index];
          chatHistory.value[messageIndex].text = streamedText;

          setTimeout(() => addNextWord(index + 1), 50); // Adjust delay for speed
        } else {
          resolve();
        }
      }
      addNextWord(0);
    });
  }

  return {
    response,
    encounter,
    gameActive,
    chatHistory,
    generateLoading,
    actionLoading,
    generateEncounter,
    performAction,
    $reset,
  };
});
