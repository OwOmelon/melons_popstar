import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useBoardStore } from "./board";

export type GameState = "ONGOING" | "WIN" | "LOSE";

export const useGameStateStore = defineStore("game-state", () => {
	const board = useBoardStore();

	// --------------------

	const points = ref<number>(0);
	const stage = ref<number>(1);
	const goal = ref<number>(1000);

	const organizingBoard = ref<boolean>(false);
	const showBonusComponent = ref<boolean>(false);

	function resetState(): void {
		points.value = 0;
		stage.value = 1;
		goal.value = 1000;
	}

	function nextStage(): void {
		stage.value++;
		goal.value = goal.value + (stage.value >= 3 ? 3000 : 2000);
	}

	function checkFinalScore(bonus: number): void {
		points.value = points.value + bonus;

		if (points.value > goal.value) {
			alert(`stage ${stage.value} pass`);

			nextStage();
		} else {
			alert(`stage ${stage.value} fail`);

			resetState();
		}

		showBonusComponent.value = false;

		board.board = board.createBoard();
	}

	function checkBoardFinished(): boolean {
		return board.board.every((column, x) => {
			const hasClearableTile = column.some((tile, y) => {
				if (tile.state === "CLEARED") return false;
				if (tile.state === "EXPLODING") return true;

				const adjacentTiles = board
					.getLinearAdjacentPositions({ x, y })
					.map((adjPos) => board.getTile(adjPos));

				const clearable = adjacentTiles.some(
					(adjTile) =>
						adjTile?.state === "IDLE" && adjTile?.color === tile.color,
				);

				return clearable;
			});

			return !hasClearableTile;
		});
	}

	// --------------------

	return {
		points,
		stage,
		goal,

		organizingBoard,
		showBonusComponent,

		resetState,
		nextStage,
		checkFinalScore,
		checkBoardFinished,
	};
});
