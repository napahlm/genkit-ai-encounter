<template>
  <div class="chat-window">
    <div class="chat-messages">
      <ChatMessage v-for="(msg, index) in store.chatHistory" :key="index" :text="msg.text" :sender="msg.sender" />
    </div>
  </div>

  <div class="chat-input">
    <input v-model="newMessage" placeholder="What will you do?" :disabled="!gameActive" />
    <Button @click="sendMessage" :disabled="!gameActive">Send</Button>
    <Button @click="store.generateEncounter()">Reset</Button>
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
.chat-window {
  min-width: 400px;
  border: 2px solid #444;
  border-radius: 10px;
  background: black;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.chat-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>