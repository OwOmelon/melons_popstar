<script setup lang="ts">
import BG from "@/app/components/BG.vue";

import PauseBtn from "@/settings/components/pause/Button.vue";
import PauseMenu from "@/settings/components/pause/Menu.vue";
import ChangeBoardSize from "@/settings/components/ChangeBoardSize.vue";

import GameInfo from "@/gamestate/components/GameInfo.vue";
import EndGameBonus from "@/gamestate/components/EndGameBonus.vue";
import GameOver from "@/gamestate/components/GameOver.vue";

import Board from "@/board/components/Board.vue";
import ModalWrapper from "@/app/components/ModalWrapper.vue";

// ----------

import { storeToRefs } from "pinia";

import { useGameStateStore } from "@/gamestate/stores/gamestate";
import { useSettingsStore } from "@/settings/stores/settings";

const { gameover, points, goal, stage, stagePass, endGameBonus, paused } =
  storeToRefs(useGameStateStore());
const { newBoardTransition, resetState } = useGameStateStore();

const { changingBoardSize } = storeToRefs(useSettingsStore());
const { changeBoardSize } = useSettingsStore();

async function restart(): Promise<void> {
  gameover.value = false;

  await newBoardTransition();
  resetState();
}
</script>

<template>
  <BG />

  <div
    id="area"
    class="relative flex h-screen max-h-[78ex] min-h-[680px] w-[30em] max-w-[100vw] flex-col"
  >
    <PauseBtn class="mb-5 ml-auto mr-5 mt-3" />

    <GameInfo />
    <EndGameBonus />

    <Board />
  </div>

  <Transition name="slow-fade">
    <GameOver v-if="gameover" @restart="restart" />
  </Transition>

  <Transition name="fade">
    <ChangeBoardSize
      v-if="paused && changingBoardSize"
      @increase="changeBoardSize('inc')"
      @decrease="changeBoardSize('dec')"
      @done="changingBoardSize = false"
    />
  </Transition>

  <ModalWrapper :show="paused && !changingBoardSize">
    <PauseMenu @close="paused = false" @restart="restart" />
  </ModalWrapper>
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
  @apply flex min-h-screen flex-col items-center justify-center overflow-hidden;
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
</style>
