<template>
    <div class="main-container">
        <div class="app-title">
            <span class="title-text">AI Encounter</span>
            <a href="https://github.com/napahlm" target="_blank" class="github-link">
                <span class="username">napahlm</span>
                <i class="pi pi-github"></i>
            </a>
        </div>
        <div class="cards">
            <CharacterCard :name="'Player'" :player="true" :hp="store.encounter?.playerCurrentHp"
                :maxHp="store.encounter?.playerHp" :dmg="store.encounter?.playerDmg" />
            <CharacterCard :name="'Enemy'" :player="false" :hp="store.encounter?.enemyCurrentHp"
                :maxHp="store.encounter?.enemyHp" :dmg="store.encounter?.enemyDmg" />
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
    height: 100dvh;
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

.app-title {
    position: absolute;
    top: 10px;
    right: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 18px;
    font-weight: bold;
    color: white;
}

.divider {
  height: 20px;
  width: 2px;
  background-color: rgba(255, 255, 255, 0.6);
}

.github-link {
    display: flex;
    align-items: center;
    gap: 5px;
    text-decoration: none;
    color: #c9d1d9;
    transition: color 0.3s ease-in-out;
}

.github-link:hover {
    color: #58a6ff;
}

.username {
    font-size: 16px;
}

.pi-github {
    font-size: 20px;
}
</style>