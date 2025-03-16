<template>
    <div class="main-container">
        <div class="cards">
            <CharacterCard :name="'Player'" :player="true" :hp="store.encounter?.playerCurrentHp" :maxHp="store.encounter?.playerHp"
                :dmg="store.encounter?.playerDmg" />
            <CharacterCard :name="'Enemy'" :player="false" :hp="store.encounter?.enemyCurrentHp" :maxHp="store.encounter?.enemyHp"
                :dmg="store.encounter?.enemyDmg" />
        </div>

        <ChatWindow :gameActive="store.gameActive" />
    </div>
</template>

<script setup>
import { useGenkitStore } from "../stores/useGenkit";
import CharacterCard from "./../../components/CharacterCard.vue";
import ChatWindow from "./../../components/ChatWindow.vue";

const store = useGenkitStore();

</script>

<style scoped>
.main-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 80%;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    gap: 12px;
}

.cards {
    display: flex;
    gap: 12px;
    flex-direction: row;
}

@media (max-width: 768px) {
    .main-container {
        width: 100%;
        padding: 10px;
    }
}
</style>