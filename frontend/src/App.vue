<script setup>
import { ref } from "vue";
import { useGenkitStore } from "./stores/useGenkit";

const store = useGenkitStore();
const actionText = ref("");

// Helper function to simulate streaming update of a response.
function simulateStreaming(fullResponse) {
  let streamedResponse = "";
  const words = fullResponse.split(" ");
  let index = 0;

  // Add an initial empty response entry to chatHistory.
  store.chatHistory.push("Response: ");
  // Get the index of the response we will update.
  const responseIndex = store.chatHistory.length - 1;

  // Use setInterval to simulate streaming word-by-word.
  const interval = setInterval(() => {
    if (index < words.length) {
      streamedResponse += words[index] + " ";
      // Update the last chat entry.
      store.chatHistory[responseIndex] = "Response: " + streamedResponse;
      index++;
    } else {
      clearInterval(interval);
    }
  }, 200); // adjust delay (in ms) for streaming speed
}

async function doAction() {
  if (actionText.value && store.gameActive) {
    try {
      // Call performAction with the current action text.
      await store.performAction(actionText.value);
      // Record the player's action.
      store.chatHistory.push(`You: ${actionText.value}`);
      // Simulate streaming of the response narrative.
      simulateStreaming(store.encounter.lastNarrative);
      // Clear the input.
      actionText.value = "";
    } catch (err) {
      console.error("Action failed:", err);
    }
  }
}
</script>

<template>
  <div>
    <h1>Test greeter()</h1>
    <button @click="store.callGenkitFlow()">Call Genkit Flow</button>
    <p>Response:</p>
    <p v-if="store.response">{{ store.response }}</p>
  </div>
  
  <div>
    <h1>Test generateEncounter()</h1>
    <button @click="store.generateEncounter()">Generate Encounter</button>
    <p v-if="store.encounter">
      <strong>Last Narrative:</strong> {{ store.encounter.lastNarrative }}
    </p>
    <p v-if="store.encounter">
      <strong>Full Narrative:</strong> {{ store.encounter.fullNarrative }}
    </p>
  </div>

  <div>
    <h1>Continue generated narrative</h1>
    <input 
      v-model="actionText" 
      placeholder="What will you do?" 
      :disabled="!store.gameActive" 
    />
    <button @click="doAction()">Perform action</button>
    <button @click="store.generateEncounter()">New story</button>
  </div>

  <div>
    <h2>Chat History</h2>
    <ul>
      <li v-for="(chat, index) in store.chatHistory" :key="index">
        {{ chat }}
      </li>
    </ul>
  </div>
</template>
