<template>
  <div :class="['chat-message', sender === 'player' ? 'right' : 'left']">
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: String,
  sender: String, // "player" or "ai"
});
</script>

<style scoped>
.chat-message {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  max-width: 70%;
}

.left {
  background: #333;
  color: white;
  align-self: flex-start;
}

.right {
  background: #007bff;
  color: white;
  align-self: flex-end;
}
</style>