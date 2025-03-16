<template>
  <div class="chat-container">
    <div class="chat-window">
      <div class="chat-messages">
        <ChatMessage v-for="(msg, index) in store.chatHistory" :key="index" :text="msg.text" :sender="msg.sender" />
      </div>
    </div>

    <div class="chat-input">
      <input v-model="newMessage" placeholder="What will you do?" :disabled="!gameActive" />
      <Button class="input-btn" @click="sendMessage" icon="pi pi-send" :disabled="!gameActive" />
      <Button class="input-btn" label="New encounter" @click="store.generateEncounter()" icon="pi pi-sparkles" />
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
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 2px solid #444;
  border-radius: 10px;
  background: black;
  padding: 10px;
  overflow: hidden;
}

.chat-messages {
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
}

.input-btn:hover {
  background-image: linear-gradient(45deg, #388dce 0%, #c8195f 60%) !important;
}

.input-btn:disabled {
  background-image: linear-gradient(45deg, grey 0%, darkgrey 100%) !important;
}

.input-btn:active {
  transform: scale(0.97); /* Example for a "pressing down" effect */
}
</style>