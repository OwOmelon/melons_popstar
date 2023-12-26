<script setup lang="ts">
import Board from "./components/Board.vue";
import debug from "./components/_debug.vue";

import { useGameStateStore } from "./stores/game_state";

const state = useGameStateStore();
</script>

<template>
  <div>
    <p>{{ state.points }} | {{ state.gameOver }}</p>
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
</style>
