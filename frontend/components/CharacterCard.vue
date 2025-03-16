<template>
  <div class="character-card">
    <h3>{{ name || "-" }}</h3>
    <p>HP: {{ hp ?? "-" }} / {{ maxHp ?? "-" }}</p>
    <p>DMG: {{ dmg ?? "-" }}</p>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  hp: Number,
  maxHp: Number,
  dmg: Number,
});
</script>

<style scoped>
.character-card {
  border: 2px solid #444;
  padding: 10px;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}
</style>