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
			'relative flex gap-1',
		]"
		v-on-click-outside="
			() => {
				board.unselectAllTiles();
			}
		"
	>
		<div
			v-for="(column, columnIndex) in board.board"
			class="relative flex flex-col gap-[inherit]"
		>
			<Tile
				v-for="(tile, rowIndex) in column"
				v-bind="tile"
				:key="tile.id"
				@select="onTileSelect({ x: columnIndex, y: rowIndex })"
				@explode="onTileExplode"
				@force-select="tile.state = 'SELECTED'"
			/>

			<button
				:key="`btn${columnIndex}`"
				class="mx-auto rounded-full bg-black p-2"
				@click="board.board.splice(columnIndex, 1)"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.board {
	&-move,
	&-enter-active,
	&-leave-active {
		transition: all 300ms cubic-bezier(0.5, 0.05, 0.8, 1);
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
		width: 0;
	}

	&-leave-active {
		position: absolute;
	}
}

.column {
	&-move,
	&-enter-active,
	&-leave-active {
		transition: all 300ms cubic-bezier(0.5, 0.05, 0.8, 1);
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
	}

	&-leave-active {
		position: absolute;
	}
}
</style>
