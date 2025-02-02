<script setup lang="ts">
// !!! ADD HIGHSCORE / PREVIOUS HIGHSCORES FEATURE

import BG from "@/app/components/BG.vue";

import PauseBtn from "@/settings/components/pause/Button.vue";
import PauseMenu from "@/settings/components/pause/Menu.vue";

import GameInfo from "@/gamestate/components/GameInfo.vue";
import BoardClearBonus from "@/gamestate/components/BoardClearBonus.vue";
import GameOver from "@/gamestate/components/GameOver.vue";

import Board from "@/board/components/Board.vue";
import ModalWrapper from "@/app/components/ModalWrapper.vue";

import Scores from "@/scores/components/Scores.vue";
import ShowAllScoresButton from "@/scores/components/ShowAllScoresButton.vue";

import { useTemplateRef, ref } from "vue";
import { storeToRefs } from "pinia";

import { useBoardStore } from "@/board/stores/board";
import { useGameStateStore } from "@/gamestate/stores/gamestate";
import { useSettingsStore } from "@/settings/stores/settings";
import { useScoresStore } from "@/scores/stores/scores";

import { delay } from "@/app/utils/delay";
import { shakeElement } from "@/app/utils/shake_element";

// ----------

const { board } = storeToRefs(useBoardStore());
const { resetBoard, getTile, isBoardCleared } = useBoardStore();

const { gameover, points, stagePass } = storeToRefs(useGameStateStore());
const { resetState, addPoints, nextStage } = useGameStateStore();

const { paused, settings_Toggles } = storeToRefs(useSettingsStore());

const { saveScore } = useScoresStore();

// ----------

const boardRef = useTemplateRef<typeof Board>("boardRef");

function shakeBoardRef() {
	if (settings_Toggles.value.board_shake && boardRef.value?.$el) {
		shakeElement(boardRef.value.$el);
	}
}

function onTileClear(tilesCleared: number) {
	// !!! ADD TILE CLEAR ANIM

	shakeBoardRef();
	addPoints(tilesCleared);

	if (!isBoardCleared()) onBoardClear();
}

async function onBoardClear(): Promise<void> {
	boardClearBonus.value = boardClearBonus_Max;

	await delay(500);
	await getBoardClearBonus();
	await delay(500);

	points.value += boardClearBonus.value!;
	boardClearBonus.value = -1;

	if (stagePass.value) {
		await boardResetAnimation();
		nextStage();
	} else {
		gameover.value = true;
		saveScore(points.value);
	}
}

function restartGame() {
	resetState();
	boardResetAnimation();
}

// ===============

const boardClearBonus_Max = 2000;
const boardClearBonus = ref<number>(-1);

async function getBoardClearBonus(): Promise<void> {
	if (boardClearBonus.value === -1) return;

	const delayAmount = 100;
	let subtrahend = 20;
	let tilesChecked = 0;

	for (let y = 0; y < 10; y++) {
		for (const x of board.value.keys()) {
			if (boardClearBonus.value <= 0) break;

			const tile = getTile({ x, y })!;

			if (tile.state === "IDLE") {
				tile.state = "CLEARED";
				shakeBoardRef();

				boardClearBonus.value = boardClearBonus.value - subtrahend;
				subtrahend = subtrahend + 40;

				tilesChecked++;

				await delay(delayAmount);
			}
		}
	}

	return;
}

async function boardResetAnimation(): Promise<void> {
	if (!settings_Toggles.value.board_reset_animation) {
		resetBoard();
		shakeBoardRef();

		return;
	}

	if (!boardRef.value) {
		alert("BOARD ELEMENT IS UNDEFINED");

		return;
	}

	const br = boardRef.value.$el as HTMLElement;
	const brBounding = br.getBoundingClientRect();
	const animDur = 750;
	const skipLeave = !board.value.size;

	if (!skipLeave) {
		// LEAVE RIGHT

		br.animate(
			[
				{
					transform: `translateX(${window.innerWidth - brBounding.left}px)`,
				},
			],
			{
				easing: "cubic-bezier(0.5, 0, 0.75, 0)",
				fill: "forwards",
				duration: animDur,
			},
		);

		await delay(animDur);
	}

	const startLeftPos = `translateX(${brBounding.right - window.innerWidth - brBounding.width}px) translateY(0)`;

	resetBoard();

	br.animate({ transform: startLeftPos }, { fill: "forwards", duration: 1 });

	// START LEFT
	// ENTER CENTER AND RISE UP
	// FALL DOWN

	await delay(100);

	br.animate(
		{
			transform: [
				startLeftPos,
				"translateX(0) translateY(-4rem)",
				"translateX(0)",
			],
			easing: [
				"cubic-bezier(0.25, 1, 0.5, 1)",
				"linear(0, 0.397 18.2%, 0.997 33.4%, 0.763 39.8%, 0.687 45.2%, 0.75 50.2%, 0.998 57.8%, 0.857 65.4%, 0.999 74.6%, 0.944 80.2%, 1 88.2%, 1)",
			],
			offset: [0, 0.75],
		},
		{ fill: "forwards", duration: animDur },
	);

	await delay(animDur);
}
</script>

<template>
	<BG />

	<div
		id="area"
		class="relative flex h-screen max-h-[750px] w-full max-w-[30em] flex-col px-2 pb-2"
	>
		<div class="mb-5 ml-auto mr-5 mt-3">
			<ShowAllScoresButton class="lg:hidden" />
			<PauseBtn class="ml-3" />
		</div>

		<GameInfo />
		<BoardClearBonus :board-clear-bonus="boardClearBonus" />

		<Scores :current-score="points" />

		<Board ref="boardRef" @on-tile-clear="onTileClear" />
	</div>

	<Transition name="slow-fade">
		<GameOver v-if="gameover" @restart="restartGame" />
	</Transition>

	<ModalWrapper :show="paused">
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
