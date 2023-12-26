import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useBoardStore } from "./board";

export type GameState = "ONGOING" | "WIN" | "LOSE";

export const useGameStateStore = defineStore("game-state", () => {
	const board = useBoardStore();

	// --------------------

	const points = ref<number>(0);
	const goal = ref<number>(0);

	// const state = ref<GameState>("ONGOING");
	const gameOver = ref<boolean>(false);

	const organizingBoard = ref<boolean>(false);

	const stateTable = ref(
		board.board.map((column, y) => {
			return column.map((tile, x) => {
				const adjacenTiles = board
					.getLinearAdjacentPositions({ x, y })
					.map((adjPos) => board.getTile(adjPos));

				const clearable = adjacenTiles.some(
					(adjTile) =>
						adjTile?.state === "IDLE" && adjTile?.color === tile.color,
				);

				return clearable ? tile.color : undefined;
			});
		}),
	);

	// --------------------

	return {
		points,
		goal,
		gameOver,
		organizingBoard,
	};
});
