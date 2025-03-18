<template>
  <FieldSet v-if="name" :class="['fieldset-card', isPlayer ? 'player-card' : 'enemy-card']">
    <template #legend>
      <span class="font-bold">{{ isPlayer ? 'You' : 'Enemy' }}</span>
    </template>
    <div v-if="!store.generateLoading && hp">
      <p>HP: {{ hp }}/{{ maxHp }}</p>
      <p>DMG: 0-{{ dmg }}</p>
    </div>
  </FieldSet>
</template>

<script setup>
import { computed } from 'vue';
import { useGenkitStore } from '../src/stores/useGenkit';

const store = useGenkitStore();

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
.fieldset-card {
  border-color: white;
}

.player-card {
  background-image: linear-gradient(45deg, rgb(4, 136, 87), rgb(36, 22, 78));
}

.enemy-card {
  background-image: linear-gradient(45deg, rgb(193, 8, 8), rgb(22, 31, 41));
}
</style>