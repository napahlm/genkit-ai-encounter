<template>
  <div class="chat-container">
    <div class="chat-window">
      <div class="chat-messages">
        <ChatMessage v-for="(msg, index) in store.chatHistory" :key="index" :text="msg.text" :sender="msg.sender" />
      </div>
    </div>

    <div class="chat-input">
      <input v-model="newMessage" placeholder="What will you do?" :disabled="!gameActive" />
      <Button @click="sendMessage" icon="pi pi-send" :disabled="!gameActive" />
      <Button label="New encounter" @click="store.generateEncounter()" icon="pi pi-sparkles" class="encounter-btn" />
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
}
</style>