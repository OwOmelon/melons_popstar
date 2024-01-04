<script setup lang="ts">
import { ref } from "vue";
import Board from "./components/Board.vue";
import GetEndGameBonus from "./components/GetEndGameBonus.vue";
import debug from "./components/_debug.vue";

import { useGameStateStore } from "./stores/game_state";

const game_state = useGameStateStore();

const bonus = ref<InstanceType<typeof GetEndGameBonus> | null>(null);
</script>

<template>
  <div>
    <p>stage: {{ game_state.stage }} goal: {{ game_state.goal }}</p>
    <p
      :class="[
        { 'bg-amber-500 text-white': game_state.points >= game_state.goal },
      ]"
    >
      points: {{ game_state.points }}
    </p>

    <GetEndGameBonus
      ref="bonus"
      v-if="game_state.showBonusComponent"
      @bonus="game_state.checkFinalScore"
    />
    <Board />

    <button class="mx-auto block" @click="bonus?.getEndGameBonus()">
      get bonus
    </button>
  </div>

  <debug />
</template>

<style lang="postcss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600;800&display=swap");

*,
*::before,
*::after {
  @apply m-0 box-border p-0;
}

body {
  @apply bg-amber-100 font-["Poppins",_sans-serrif];
}

#app {
  @apply flex min-h-screen flex-col items-center justify-center;
}
</style>
