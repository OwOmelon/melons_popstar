<script setup lang="ts">
import { ref } from "vue";
import Board from "./components/Board.vue";
import GetEndGameBonus from "./components/GetEndGameBonus.vue";
import debug from "./components/_debug.vue";

import { useGameStateStore } from "./stores/game_state";

const game_state = useGameStateStore();
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

.pts-anim {
  animation: pts-anim 800ms ease forwards;
}

@keyframes pts-anim {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.clear-row-flash {
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 45%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 1) 55%,
    rgba(255, 255, 255, 1) 1000%
  );
     
    background-position: center;
  background-repeat: no-repeat;

  animation: clear-row-flash 1s linear forwards;
}

@keyframes clear-row-flash {
  from {
     background-size: 100% 100%;

  }

  to {
     background-size: 20000% 100%;

  }
}
</style>
