<template>
  <div class="chat-container">
    <div class="chat-window">
      <div class="chat-messages">
        <ChatMessage v-for="(msg, index) in store.chatHistory" :key="index" :text="msg.text" :sender="msg.sender" />
      </div>
    </div>

    <div class="chat-input">
      <InputText class="input-field" @keyup.enter="sendMessage" v-model="newMessage" placeholder="What will you do?" :disabled="!gameActive" />
      <Button class="input-btn" @click="sendMessage" :icon="store.actionLoading ? 'pi pi-spin pi-spinner' : 'pi pi-send'" :disabled="!gameActive || store.actionLoading" />
      <Button class="encounter-btn input-btn" :class="{ active: gameActive || store.generateLoading }" :label="gameActive || store.generateLoading ? '' : 'Generate'" @click="store.generateEncounter()" :icon="store.generateLoading ? 'pi pi-spin pi-spinner' : 'pi pi-sparkles'" :disabled="store.generateLoading" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChatMessage from "./ChatMessage.vue";
import { useGenkitStore } from "../src/stores/useGenkit";

const store = useGenkitStore();

defineProps({
  gameActive: Boolean
});

const newMessage = ref("");

function sendMessage() {
  const actionText = newMessage.value.trim();
  if (actionText) {
    store.performAction(actionText)
    newMessage.value = "";
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
  min-width: 320px;
}

.chat-window {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  border: 2px solid #444;
  border-radius: 10px;
  background: black;
  padding: 10px;
  overflow: hidden;
}

.chat-messages {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
  margin-top: 10px;
  overflow-y: auto;
}

.chat-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-input input {
  flex: 1;
  min-width: 150px;
  height: 100%;
  border-radius: 6px;
}

.input-btn {
  background-color: #388dce;
  background-image: linear-gradient(45deg, #388dce 0%, #c8195f 100%) ;
  border: 1px solid white;
  overflow: hidden;
  white-space: nowrap;
  transition: width 0.5s ease;
  min-width: 40px;
  height: 40px;
}

.input-btn:hover {
  background-image: linear-gradient(45deg, #388dce 0%, #c8195f 60%) !important;
  border-color: white !important;
}

.input-btn:disabled {
  background-image: linear-gradient(45deg, grey 0%, darkgrey 100%) !important;
}

.input-btn:active {
  transform: scale(0.97); /* Example for a "pressing down" effect */
}

.encounter-btn {
  width: 120px;
  flex-shrink: 0;
}

.encounter-btn.active {
  width: 40px;
}

.input-field:focus {
  border-color: white !important;
}
</style>