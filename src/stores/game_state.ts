import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useBoardStore } from "./board";
import { delay } from "../composables/delay";

export type GameState = "ONGOING" | "WIN" | "LOSE";

export const useGameStateStore = defineStore("game-state", () => {
	const board = useBoardStore();

	// --------------------

	const paused = ref<boolean>(false);
	const gameover = ref<boolean>(false);

	const points = ref<number>(0);
	const stage = ref<number>(1);
	const goal = ref<number>(1000);

	const endGameBonus = ref<number | null>(null);

	function resetState(): void {
		points.value = 0;
		stage.value = 1;
		goal.value = 1000;
	}

	function nextStage(): void {
		stage.value++;
		goal.value = goal.value + (stage.value >= 3 ? 3000 : 2000);
	}

	function addEndGameBonus(): void {
		points.value = points.value + (endGameBonus.value || 0);
		resetEndGameBonus();
	}

	function resetEndGameBonus(): void {
		endGameBonus.value = 2000;
	}

	async function getEndGameBonus(): Promise<void> {
		if (!endGameBonus.value) return;

		const delayAmount = 400;
		let subtrahend = 20;

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < board.board.length; x++) {
				if (endGameBonus.value <= 0) return;

				const tile = board.getTile({ x, y })!;

				if (tile.state === "IDLE") {
					tile.state = "CLEARED";

					endGameBonus.value = endGameBonus.value - subtrahend;
					subtrahend = subtrahend + 40;

					await delay(delayAmount);
				}
			}
		}

		return;
	}

	async function newBoardTransition(): Promise<void> {
		const boardEl = document.getElementById("board")!;
		const boardAnimationDuration = 3000;

		boardEl.classList.add("board-leave");

		await delay(boardAnimationDuration);

		board.board = board.createBoard();
		boardEl.classList.remove("board-leave");
		boardEl.classList.add("board-enter");

		await delay(boardAnimationDuration);

		boardEl.classList.remove("board-enter");
	}

	function checkBoardFinished(): boolean {
		return board.board.every((column, x) => {
			const hasClearableTile = column.some((tile, y) => {
				if (tile.state === "CLEARED") return false;

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
		paused,
		gameover,

		points,
		stage,
		goal,

		endGameBonus,

		resetState,
		nextStage,
		addEndGameBonus,
		resetEndGameBonus,
		getEndGameBonus,
		newBoardTransition,
		checkBoardFinished,
	};
});
