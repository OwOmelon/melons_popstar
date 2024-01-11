<script setup lang="ts">
import { ref, computed } from "vue";
import { useElementSize } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import { useBoardStore } from "@/stores/board";
import { useGameStateStore } from "@/stores/game_state";
import { delay } from "@/composables/delay";

import type { TilePosition } from "@/stores/board";

import Tile from "./Tile.vue";

const board = useBoardStore();
const game_state = useGameStateStore();

const boardEl = ref<HTMLElement | null>(null);
const { width } = useElementSize(boardEl);

const boardElGap = computed<string>(() => {
	return `${width.value / 80}px`;
});

// ----------

function selectTile(pos: TilePosition) {
	board.deselectAllTiles();
	board.selectTiles(pos);
}

async function clearTile() {
	board.clearSelectedTiles();
	await board.organizeBoard();

	shakeBoard();

	if (game_state.checkBoardFinished()) {
		deduce();
	}
}

function shakeBoard(): void {
	boardEl.value!.classList.add("board-shake-subtle");

	setTimeout(() => {
		boardEl.value!.classList.remove("board-shake-subtle");
	}, 100);
}

async function deduce(): Promise<void> {
	game_state.resetEndGameBonus();

	await delay(1000);
	await game_state.getEndGameBonus();

	game_state.points = game_state.points + game_state.endGameBonus!;
	game_state.endGameBonus = null;

	if (game_state.points >= game_state.goal) {
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
		class="relative flex w-[500px] max-w-[100vw] items-center justify-center gap-2 rounded bg-white/50 p-2"
		v-on-click-outside="
			() => {
				board.deselectAllTiles();
			}
		"
		@click.self="board.deselectAllTiles()"
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
				@select="selectTile({ x: columnIndex, y: rowIndex })"
				@explode="clearTile"
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
