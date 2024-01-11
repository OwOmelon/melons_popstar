<script setup lang="ts">
import { useGameStateStore } from "@/stores/game_state";

import PauseBtn from "./components/pause/Btn.vue";
import PauseMenu from "./components/pause/Menu.vue";
import GameInfo from "./components/GameInfo.vue";
import EndGameBonus from "./components/EndGameBonus.vue";
import GameOver from "./components/GameOver.vue";
import Board from "./components/board/Board.vue";
import ModalWrapper from "./components/ModalWrapper.vue";
import debug from "./components/_debug.vue";

const game_state = useGameStateStore();

async function restart(): Promise<void> {
  game_state.gameover = false

  await game_state.newBoardTransition()
  game_state.resetState()
}
</script>

<template>
  <div class="relative flex h-screen flex-col">
    <PauseBtn class="mb-5 ml-auto mr-5 mt-3" />

    <GameInfo />

    <div class="grid grow place-items-center">
      <Transition name="slow-fade" mode="out-in">
        <EndGameBonus
          ref="bonus"
          v-if="game_state.endGameBonus !== null"
          :bonus="game_state.endGameBonus || 0"
        />
      </Transition>
    </div>

    <div class="relative">
      <Board />

      <Transition name="slow-fade">
        <GameOver
          v-if="game_state.gameover"
          class="absolute top-[25%] w-full"
          @restart="restart"
        />
      </Transition>
    </div>
  </div>

  <ModalWrapper :show="game_state.paused">
    <PauseMenu @close="game_state.paused = false" />
  </ModalWrapper>

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

/* ----- */

.clear-row-flash {
  position: absolute;
  height: 2.5rem;
  width: 100%;

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

  animation: clear-row-flash 1s linear infinite;
}

@keyframes clear-row-flash {
  from {
    background-size: 100% 100%;
  }

  to {
    background-size: 10000% 100%;
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
