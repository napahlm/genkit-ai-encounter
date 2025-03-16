<template>
    <div class="home">
        <div class="battle">
            <CharacterCard :name="'Player'" :hp="store.encounter?.playerCurrentHp" :maxHp="store.encounter?.playerHp"
                :dmg="store.encounter?.playerDmg" />
            <CharacterCard :name="'Enemy'" :hp="store.encounter?.enemyCurrentHp" :maxHp="store.encounter?.enemyHp"
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
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    min-height: 100vh;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
}

.battle {
    display: flex;
    gap: 20px;
    justify-content: center;
    width: 100%;
}

@media (max-width: 768px) {
    .home {
        max-width: 100%;
        padding: 10px;
    }

    .battle {
        align-items: center;
    }
}
</style>