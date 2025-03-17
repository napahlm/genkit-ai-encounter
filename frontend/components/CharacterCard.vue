<template>
  <div v-if="name" :class="['character-card', isPlayer ? 'player-card' : 'enemy-card']">
    <h3>{{ name || "-" }}</h3>
    <p>HP: {{ hp ?? "-" }} / {{ maxHp ?? "-" }}</p>
    <p>DMG: {{ dmg ?? "-" }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: String,
  player: Boolean,
  hp: Number,
  maxHp: Number,
  dmg: Number,
});

const isPlayer = computed(() => props.name?.toLowerCase() === 'player');
</script>

<style scoped>
.character-card {
  border: 2px solid #444;
  padding: 10px;
  border-radius: 8px;
  width: 120px;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.player-card {
  background-color: rgb(30, 70, 35);
}

.enemy-card {
  background-color: rgb(80, 15, 15);
}
</style>