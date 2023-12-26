import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useGameStateStore } from "./game_state";

export type TilePosition = {
	x: number;
	y: number;
};

export type TileState = "IDLE" | "EXPLODE" | "CLEARED";
export type TileColor = "YELLOW" | "PURPLE" | "BLUE" | "GREEN" | "RED";

export type Tile = {
	readonly color: TileColor;
	state: TileState;
};

export const useBoardStore = defineStore("board", () => {
	const state = useGameStateStore();

	// --------------------

	const board = ref<Tile[][]>([]);

	createBoard();
	function createBoard(): void {
		const tilePalette: TileColor[] = [
			"YELLOW",
			"PURPLE",
			"BLUE",
			"GREEN",
			"RED",
		];

		let newGrid: Tile[][] = [];

		for (let x = 0; x < 10; x++) {
			const newColumn: Tile[] = [];

			for (let y = 0; y < 10; y++) {
				const tile: Tile = {
					state: "IDLE",
					color: tilePalette[Math.floor(Math.random() * tilePalette.length)],
				};

				newColumn.push(tile);
			}

			newGrid.push(newColumn);
		}

		board.value = newGrid;
	}

	function explodeTile(pos: TilePosition): boolean {
		const tile = getTile(pos);

		if (!tile || tile.state === "CLEARED") return false;

		let tileWasCleared = false;
		const adjacentPositions = getLinearAdjacentPositions(pos);

		adjacentPositions.forEach((adjPos) => {
			const adjTile = getTile(adjPos);

			if (!adjTile || adjTile.state !== "IDLE") return false;

			if (adjTile.color === tile.color) {
				tileWasCleared = true;
				adjTile.state = "EXPLODE";

				explodeTile(adjPos);
			}
		});

		return tileWasCleared;
	}

	function organizedBoard(): void {
		state.organizingBoard = true;

		setTimeout(() => {
			const organizedBoard: Tile[][] = [];
			let pointsEarned = 5;
			let scoreMultiplier = 0;

			board.value.forEach((column) => {
				const organizedColumn: Tile[] = [];
				let clearedTiles = 0;

				column.forEach((tile) => {
					if (tile.state === "EXPLODE") {
						tile.state = "CLEARED";

						pointsEarned = pointsEarned + scoreMultiplier * 10;
						scoreMultiplier++;

						organizedColumn.unshift(tile);
					} else {
						organizedColumn.push(tile);
					}

					if (tile.state === "CLEARED") clearedTiles++;
				});

				if (clearedTiles !== column.length) {
					organizedBoard.push(organizedColumn);
				}
			});

			board.value = organizedBoard;

			state.points = state.points + pointsEarned;
			state.organizingBoard = false;
			state.gameOver = checkGameOver();
		}, 500);
	}

	function checkGameOver(): boolean {
		return board.value.every((column, columnIndex) => {
			return column.every((tile, rowIndex) => {
				const adjacentTiles = getLinearAdjacentPositions({
					x: rowIndex,
					y: columnIndex,
				}).map((adjPos) => getTile(adjPos));

				return adjacentTiles.some(
					(adjTile) =>
						adjTile?.state === "IDLE" && adjTile?.color === tile.color,
				);
			});
		});
	}

	function getTile(pos: TilePosition): Tile | undefined {
		return board.value?.[pos.x]?.[pos.y] ?? undefined;
	}

	function getLinearAdjacentPositions(pos: TilePosition): TilePosition[] {
		return [
			{ x: pos.x, y: pos.y - 1 },
			{ x: pos.x, y: pos.y + 1 },
			{ x: pos.x - 1, y: pos.y },
			{ x: pos.x + 1, y: pos.y },
		];
	}

	// --------------------

	return {
		board,
		createBoard,
		explodeTile,
		organizedBoard,
		checkGameOver,
		getTile,
		getLinearAdjacentPositions,
	};
});
