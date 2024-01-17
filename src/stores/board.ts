import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { useGameStateStore } from "./game_state";
import { delay } from "@/composables/delay";
import { clearPtsAnim } from "@/eyecandy/clear-pts-anim";
import { clearRowFlash } from "@/eyecandy/clear-row-flash";

export type TilePosition = {
	x: number;
	y: number;
};

export type TileID = `spawnx${number}y${number}`;
export type TileState = "IDLE" | "SELECTED" | "TO_CLEAR" | "CLEARED";
export type TileColor = "YELLOW" | "PURPLE" | "BLUE" | "GREEN" | "RED";

export type Tile = {
	readonly id: TileID;
	readonly color: TileColor;
	state: TileState;
	points: number;
	delay: number /* ANIMATION/TRANSITION DELAY */;
};

export const useBoardStore = defineStore("board", () => {
	const game_state = useGameStateStore();

	// --------------------

	const boardSize = 10;

	const board = ref<Tile[][]>(createBoard());
	const selectedTilePositions = ref<TilePosition[][]>([]);

	function createBoard(): Tile[][] {
		const tilePalette: TileColor[] = [
			"YELLOW",
			"PURPLE",
			"BLUE",
			"GREEN",
			"RED",
		];

		const board: ReturnType<typeof createBoard> = [];

		for (let x = 0; x < boardSize; x++) {
			const column: Tile[] = [];

			for (let y = 0; y < boardSize; y++) {
				const tile: Tile = {
					id: `spawnx${x}y${y}`,
					color: tilePalette[Math.floor(Math.random() * tilePalette.length)],
					state: "IDLE",
					points: 0,
					delay: 0,
				};

				column.push(tile);
			}

			board.push(column);
		}

		return board;
	}

	// --------------------

	function selectTiles(pos: TilePosition): void {
		const tile = getTile(pos);

		if (!tile || tile.state === "CLEARED") return;

		const adjacentPositions = getLinearAdjacentPositions(pos);

		adjacentPositions.forEach((adjPos) => {
			const adjTile = getTile(adjPos);

			if (!adjTile || adjTile.state !== "IDLE") return;

			if (adjTile.color === tile.color) {
				adjTile.state = "SELECTED";

				selectTiles(adjPos);
			}
		});
	}

	function deselectAllTiles(): void {
		board.value.forEach((column) => {
			column.forEach((tile) => {
				if (tile.state === "SELECTED") {
					tile.state = "IDLE";
				}
			});
		});
	}

	function clearSelectedTiles(): void {
		let pointsEarned = 5;

		board.value.forEach((column) => {
			column.forEach((tile) => {
				if (tile.state === "SELECTED") {
					tile.state = "TO_CLEAR";
					tile.points = pointsEarned;

					pointsEarned = pointsEarned + 10;
				}
			});
		});
	}

	async function organizeBoard(): Promise<void> {
		const organizedBoard: Tile[][] = [];
		const rowClears: number[] = [];
		let totalPointsEarned = 0;

		board.value.forEach((column, x) => {
			const organizedColumn: Tile[] = [];
			let clearedTiles = 0;

			column.forEach((tile, y) => {
				if (tile.state === "TO_CLEAR") {
					tile.state = "CLEARED";
					organizedColumn.unshift(tile);
					rowClears.push(y);

					totalPointsEarned += tile.points;

					clearPtsAnim(tile.id, tile.points);
				} else {
					organizedColumn.push(tile);
				}

				if (tile.state === "CLEARED") clearedTiles++;
			});


			if (clearedTiles !== column.length) {
				organizedBoard.push(organizedColumn);
			}
		});

		[...new Set(rowClears)].forEach((row) => {
			clearRowFlash(row);
		});

		board.value = organizedBoard;
		game_state.points += totalPointsEarned;

		return;
	}

	function getTile(pos: TilePosition): Tile | null {
		return board.value?.[pos.x]?.[pos.y] ?? null;
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
		boardSize,

		board,
		createBoard,

		deselectAllTiles,
		selectTiles,
		clearSelectedTiles,
		organizeBoard,

		getTile,
		getLinearAdjacentPositions,
	};
});
