<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import { useBoardStore } from "@/stores/board";
import { useGameStateStore } from "@/stores/game_state";

import type { TilePosition } from "@/stores/board";

import Tile from "./Tile.vue";

const board = useBoardStore();
const game_state = useGameStateStore();

function onTileSelect(pos: TilePosition) {
	board.unselectAllTiles();
	board.selectTiles(pos);
}

async function onTileExplode() {
	board.explodeSelectedTiles();
	await board.organizeBoard();

	if (game_state.checkBoardFinished()) {
		game_state.showBonusComponent = true;
	}
}
</script>

<template>
	<div
		:class="[
			{ 'pointer-events-none': game_state.organizingBoard },
			'flex gap-1',
		]"
		v-on-click-outside="
			() => {
				board.unselectAllTiles();
			}
		"
	>
		<div
			class="flex flex-col gap-[inherit]"
			v-for="(column, columnIndex) in board.board"
		>
			<Tile
				v-for="(tile, rowIndex) in column"
				v-bind="tile"
				@select="onTileSelect({ x: columnIndex, y: rowIndex })"
				@explode="onTileExplode"
				@force-explode="tile.state = 'EXPLODING'"
			/>
		</div>
	</div>
</template>
