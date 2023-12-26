<script setup lang="ts">
import { ref } from "vue";
import { useBoardStore } from "@/stores/board";
import { useGameStateStore } from "@/stores/game_state";

import Tile from "./Tile.vue";

const board = useBoardStore();
const state = useGameStateStore();
</script>

<template>
	<div
		:class="[{ 'pointer-events-none': state.organizingBoard }, 'flex gap-1']"
	>
		<div
			class="flex flex-col gap-[inherit]"
			v-for="(column, columnIndex) in board.board"
		>
			<Tile
				v-for="(tile, rowIndex) in column"
				v-bind="tile"
				@explode-tile="
					() => {
						const exploded = board.explodeTile({ x: columnIndex, y: rowIndex });

						if (exploded) board.organizedBoard();
					}
				"
			/>
		</div>
	</div>
	<div class="flex gap-2">
		<button
			@click="
				() => {
					board.board.flat().forEach((tile) => (tile.state = 'IDLE'));
				}
			"
		>
			blur
		</button>
		<button @click="board.createBoard">reset</button>
		<button
			@click="
				() => {
					console.log(board.checkGameOver());
				}
			"
		>
			check gameover
		</button>
	</div>
</template>
