import { defineStore } from "pinia";
import { ref } from "vue";
import { genkitGreet, genkitGenerateEncounter, genkitPerformAction } from "@/firebase";

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
  const chatHistory = ref(<any[]>([]));

  // action
  function $reset() {
    response.value = "";
    encounter.value = null; // main battle state
    gameActive.value = false;
    chatHistory.value = [];
  }

  async function callGenkitFlow() {
    try {
      const { data } = await genkitGreet();
      console.log("Genkit Response from Firebase:", data); // Add this line
      response.value = data as string;
    } catch (error) {
      console.error("Genkit API call failed", error);
    }
  }

  async function generateEncounter() {
    try {
      $reset();
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
      }
      gameActive.value = true;
    } catch (error) {
      console.error("Failed to generate encounter:", error);
    }
  }

  async function performAction(action: string) {
    try {
      if (!encounter.value) {
        throw new Error("No encounter has been generated.");
      }

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

      console.log("Encounter action result:", data);

    } catch (error) {
      console.error("Error performing action:", error);
    }
  }

  return {
    response,
    encounter,
    gameActive,
    chatHistory,
    callGenkitFlow,
    generateEncounter,
    performAction,
    $reset,
  }
})