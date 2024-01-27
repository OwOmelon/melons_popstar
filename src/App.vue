<script setup lang="ts">
import { useGameStateStore } from "@/stores/game_state";

import BG from "./components/BG.vue";
import PauseBtn from "./components/pause/Btn.vue";
import PauseMenu from "./components/pause/Menu.vue";
import GameInfo from "./components/GameInfo.vue";
import EndGameBonus from "./components/EndGameBonus.vue";
import GameOver from "./components/GameOver.vue";
import Board from "./components/board/Board.vue";
import ModalWrapper from "./components/ModalWrapper.vue";
import d from "./components/_debug.vue";

const game_state = useGameStateStore();

async function restart(): Promise<void> {
  game_state.gameover = false;

  await game_state.newBoardTransition();
  game_state.resetState();
}
</script>

<template>
  <BG />

  <div
    class="relative flex h-screen w-[500px] max-w-[100vw] flex-col"
  >
    <PauseBtn class="mb-5 ml-auto mr-5 mt-3" />

    <GameInfo />
    <EndGameBonus :bonus="game_state.endGameBonus" />

    <Board />
  </div>

  <Transition name="slow-fade">
    <GameOver v-if="game_state.gameover" @restart="restart" />
  </Transition>

  <ModalWrapper :show="game_state.paused">
    <PauseMenu @close="game_state.paused = false" />
  </ModalWrapper>

  <d />
</template>

<style lang="postcss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600;800&display=swap");

*,
*::before,
*::after {
  @apply m-0 box-border p-0;
}

body {
  @apply font-["Poppins",_sans-serrif];
}

#app {
  @apply flex flex-col items-center justify-center overflow-hidden;
}

.shadow-subtle {
  @apply shadow shadow-black/25;
}
</style>

<style lang="scss">
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 150ms;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

.slow-fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 1s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

/* ----- */

.board-enter {
  animation: enter 3s forwards;
}

@keyframes enter {
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ----- */

.board-leave {
  animation: leave 3s forwards;
}

@keyframes leave {
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
