<script setup lang="ts">
import { ref, computed } from "vue";
import { useElementSize } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import { useBoardStore } from "@/stores/board";
import { useGameStateStore } from "@/stores/game_state";
import { useSettingsStore } from "@/stores/settings";
import { delay } from "@/composables/delay";

import type { TilePosition } from "@/stores/board";

import Tile from "./Tile.vue";

const board = useBoardStore();
const game_state = useGameStateStore();
const settings = useSettingsStore();

const boardEl = ref<HTMLElement | null>(null);
const { width } = useElementSize(boardEl);

const boardElGap = computed<string>(() => {
	return `${width.value / 80}px`;
});

const columnWidth = computed<string>(() => {
	return `calc(10% - ${boardElGap.value})`;
});

// ----------

function selectTile(pos: TilePosition) {
	board.deselectAllTiles();
	board.selectTiles(pos);
}

async function clearTile() {
	await board.organizeBoard();

	if (settings.boardShake) shakeBoard();

	if (game_state.checkBoardFinished()) {
		deduce();
	}
}

function shakeBoard(): void {
	boardEl.value!.animate(
		[
			{
				transform: "translateX(2px) translateY(-2px)",
			},
			{
				transform: "translateX(-2px) translateY(-2px)",
			},
			{
				transform: "translateX(1px) translateY(1px)",
			},
			{
				transform: "translateX(-1px) translateY(1px)",
			},
			{
				transform: "translateX(3px) translateY(-3px)",
			},
			{
				transform: "translateX(-3px) translateY(-3px)",
			},
		],
		{ duration: 100, fill: "forwards" },
	);
}

async function deduce(): Promise<void> {
	game_state.resetEndGameBonus();

	await delay(1000);
	await game_state.getEndGameBonus();

	game_state.points = game_state.points + game_state.endGameBonus!;
	game_state.endGameBonus = null;

	if (game_state.stagePass) {
		await game_state.newBoardTransition();

		game_state.nextStage();
	} else {
		game_state.gameover = true;
	}
}
</script>

<template>
	<div
		ref="boardEl"
		id="board"
		:style="{ gap: boardElGap }"
		class="relative flex items-center justify-center gap-2 rounded p-2"
		v-on-click-outside="
			() => {
				board.deselectAllTiles();
			}
		"
		@click.self="board.deselectAllTiles()"
	>
		<div
			v-for="(column, x) in board.board"
			:style="{ width: columnWidth }"
			class="relative flex flex-col gap-[inherit]"
		>
			<Tile
				v-for="(tile, y) in column"
				v-bind="tile"
				:select-transition="settings.tileSelectAnim"
				:key="tile.id"
				@select="selectTile({ x, y })"
				@explode="clearTile"
			/>
		</div>
	</div>
</template>
