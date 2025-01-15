=<script setup lang="ts">
import Tile from "./Tile.vue";

import { ref, useTemplateRef } from "vue";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";
import { useBoardStore } from "../stores/board";

import type { TilePosition } from "../stores/board";

const { board } = storeToRefs(useBoardStore())
const { deselectAllTiles, selectTiles, organizeBoard }  = useBoardStore()

const boardEl = useTemplateRef<HTMLElement>("boardEl");

function selectTile(pos: TilePosition) {
	deselectAllTiles();
	selectTiles(pos);
}

async function clearTile() {
	await organizeBoard();

	// MOVE LOGIC BELOW OUTSIDE
	if (settings.boardShake) shakeElement(boardEl.value!);

	if (game_state.checkBoardFinished()) {
		deduce();
	}
}

async function deduce(): Promise<void> {
	// MOVE LOGIC BELOW OUTSIDE
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
	<div class="fixed left-0 top-0 bg-black p-3 text-white">
		<!-- <p>board width {{ width }}</p>
		<p>board gap? {{ boardElGap }}</p> -->
	</div>

	<div
		ref="boardEl"
		id="board"
		class="relative flex items-center justify-center gap-2 rounded p-2 gap-[0.3625rem]"
		v-on-click-outside="
			() => {
				deselectAllTiles();
			}
		"
		@click.self="deselectAllTiles()"
	>
		<div
			v-for="(column, x) in board"
			class="relative flex flex-col gap-[inherit] w-10"
		>
			<Tile
				v-for="(tile, y) in column"
				v-bind="tile"
				:key="tile.id"
				@select="selectTile({ x, y })"
				@explode="clearTile"
			/>
		</div>
	</div>
</template>
