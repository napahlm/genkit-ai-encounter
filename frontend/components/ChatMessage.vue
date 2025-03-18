<template>
  <div :class="['chat-message', sender.toLocaleLowerCase() === 'player' ? 'right' : 'left', {'loading-message': loading}]">
    <p v-if="!loading">{{ text }}</p>
    <i v-else class="pi pi-spinner pi-spin"></i>
  </div>
</template>

<script setup>
defineProps({
  text: String,
  sender: String, // "player" or "ai"
  loading: Boolean,
});
</script>

<style scoped>
.chat-message {
  padding: 6px 12px;
  border-radius: 10px;
  max-width: 80%;
  display: flex;
  align-items: center;
}

.left {
  background: #101010;
  color: white;
  align-self: flex-start;
}

.right {
  background: linear-gradient(90deg, #10045c, #1261d6);
  color: white;
  align-self: flex-end;
  margin-right: 8px;
}

.loading-message {
  width: 40px;
  height: 40px;
  justify-content: center;
  display: flex;
  align-items: center;
}
</style>