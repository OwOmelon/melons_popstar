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

import { useTemplateRef } from "vue";
import { storeToRefs } from "pinia";

import { useBoardStore } from "@/board/stores/board";
import { useGameStateStore } from "@/gamestate/stores/gamestate";
import { useSettingsStore } from "@/settings/stores/settings";

import { delay } from "@/app/utils/delay";

// ----------

const { board } = storeToRefs(useBoardStore());
const { resetBoard, getTile, isBoardCleared } = useBoardStore();

const { gameover, paused, points, endGameBonus, stagePass } =
  storeToRefs(useGameStateStore());
const { resetState, addPoints, resetEndGameBonus, nextStage } =
  useGameStateStore();

const { changingBoardSize } = storeToRefs(useSettingsStore());
const { changeBoardSize } = useSettingsStore();

// ----------

const boardRef = useTemplateRef<typeof Board>("boardRef");

function onTileClear(tilesCleared: number) {
  // ADD POINTS
  // ADD TILE CLEAR ANIM
  // SHAKE BOARD (SHOULD BE DONE IN BOARD COMPONENT?)
  // CHECK BOARD FINISHED
  // IF FINISHED, RUN END GAME LOGIC

  addPoints(tilesCleared);

  if (!isBoardCleared()) onBoardClear();
}

async function onBoardClear(): Promise<void> {
  resetEndGameBonus();

  await delay(1000);
  await getBoardClearBonus();

  points.value += endGameBonus.value!;
  endGameBonus.value = null;

  if (stagePass.value) {
    resetBoard();
    nextStage();
  } else {
    gameover.value = true;
  }
}

function restartGame() {
  resetState();
  resetBoard();
}

async function getBoardClearBonus(): Promise<void> {
  if (!endGameBonus.value) return;

  const delayAmount = 400;
  let subtrahend = 20;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < board.value.length; x++) {
      if (endGameBonus.value <= 0) return;

      const tile = getTile({ x, y })!;

      if (tile.state === "IDLE") {
        tile.state = "CLEARED";

        endGameBonus.value = endGameBonus.value - subtrahend;
        subtrahend = subtrahend + 40;

        await delay(delayAmount);
      }
    }
  }

  return;
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

    <Board ref="boardRef" @on-tile-clear="onTileClear" />
  </div>

  <Transition name="slow-fade">
    <GameOver v-if="gameover" @restart="restartGame" />
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
    <PauseMenu @close="paused = false" @restart="restartGame" />
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
