<script setup lang="ts">
import { ref, computed } from "vue";
import { useElementSize } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import { useBoardStore } from "@/stores/board";
import { useGameStateStore } from "@/stores/game_state";

import type { TilePosition } from "@/stores/board";

import Tile from "./Tile.vue";

const board = useBoardStore();
const game_state = useGameStateStore();

const boardEl = ref<HTMLElement | null>(null);
const { width } = useElementSize(boardEl);

const boardElGap = computed<string>(() => {
	return `${width.value / 80}px`;
});

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

	shakeBoard();
}

function shakeBoard(): void {
	boardEl.value!.classList.add("board-shake-subtle");

	setTimeout(() => {
		boardEl.value!.classList.remove("board-shake-subtle");
	}, 100);
}
</script>

<template>
	<div
		ref="boardEl"
		id="board"
		:style="{ gap: boardElGap }"
		class="relative flex w-[500px] max-w-[100vw] items-center justify-center gap-2 rounded bg-white/75 p-2"
		v-on-click-outside="
			() => {
				board.unselectAllTiles();
			}
		"
	>
		<div
			v-for="(column, columnIndex) in board.board"
			:style="{ width: `calc(10% - ${boardElGap})` }"
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
		</div>
	</div>
</template>

<style scoped>
.board-shake-subtle {
	animation: shake 100ms;
}

@keyframes shake {
	0% {
		transform: translateX(2px) translateY(-2px);
	}

	20% {
		transform: translateX(-2px) translateY(-2px);
	}

	40% {
		transform: translateX(1px) translateY(1px);
	}

	60% {
		transform: translateX(-1px) translateY(1px);
	}

	80% {
		transform: translateX(3px) translateY(-3px);
	}

	100% {
		transform: translateX(-3px) translateY(-3px);
	}
}
</style>
