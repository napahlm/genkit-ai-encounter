<template>
  <div :class="['chat-message', sender.toLocaleLowerCase() === 'player' ? 'right' : 'left']">
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
  max-width: 80%;
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