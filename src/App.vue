<script setup lang="ts">
// !!! ADD HIGHSCORE / PREVIOUS HIGHSCORES FEATURE

import BG from "@/app/components/BG.vue";

import PauseBtn from "@/settings/components/pause/Button.vue";
import PauseMenu from "@/settings/components/pause/Menu.vue";
import ChangeBoardSize from "@/settings/components/ChangeBoardSize.vue";

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

const { paused, settings_Toggles, changingBoardSize } =
	storeToRefs(useSettingsStore());
const { changeBoardSize } = useSettingsStore();

const { saveScore } = useScoresStore();

// ----------

const boardRef = useTemplateRef<typeof Board>("boardRef");

function shakeBoardRef() {
	if (settings_Toggles.value.boardShake.toggled && boardRef.value?.$el) {
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
	if (!boardRef.value) {
		alert("BOARD ELEMENT IS UNDEFINED");

		return;
	}

	const br = boardRef.value.$el as HTMLElement;
	const brBounding = br.getBoundingClientRect();
	const animDur = 750;
	const skipLeave =
		!board.value.size ||
		Array.from(board.value.values()).every((column) =>
			column.every((tile) => tile.state === "CLEARED"),
		);

	if (!skipLeave) {
		// LEAVE RIGHT

		br.animate(
			[
				{
					transform: `translateX(${window.innerWidth - brBounding.left}px)`,
				},
			],
			{ easing: "ease-in", fill: "forwards", duration: animDur },
		);

		await delay(animDur);
	}

	// RESET BOARD AND TELEPORT LEFT

	br.animate(
		[
			{
				transform: `translateX(${brBounding.right - window.innerWidth - brBounding.width}px)`,
			},
		],
		{ fill: "forwards", duration: 1 },
	);

	await delay(110);

	resetBoard();

	await delay(200);

	// ENTER RIGHT AND RISE UP

	br.animate(
		[
			{
				transform: "translateX(0) translateY(-4rem)",
			},
		],
		{ easing: "ease-in-out", fill: "forwards", duration: animDur },
	);

	await delay(animDur + animDur / 3);

	// FALL DOWN

	br.animate(
		[
			{
				transform: "translateX(0)",
			},
		],
		{ easing: "ease-in", fill: "forwards", duration: animDur / 5 },
	);

	await delay(animDur / 5);

	shakeBoardRef();

	return;
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
