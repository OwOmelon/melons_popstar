<script setup lang="ts">
import { ref } from "vue";
import { useBoardStore } from "@/stores/board";

import Tile from "./Tile.vue";

const board = useBoardStore();
</script>

<template>
	<div class="flex gap-1">
		<div class="flex flex-col gap-[inherit]" v-for="column in board.board">
			<Tile
				v-for="tile in column"
				v-bind="tile"
				@explode-tile="board.focusTile(tile.pos)"
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
	</div>
</template>
