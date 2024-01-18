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
export type TileState = "IDLE" | "SELECTED" | "CLEARED";
export type TileColor = "YELLOW" | "PURPLE" | "BLUE" | "GREEN" | "RED";

export type Tile = {
	readonly id: TileID;
	readonly color: TileColor;
	state: TileState;
};

export const useBoardStore = defineStore("board", () => {
	const game_state = useGameStateStore();

	// --------------------

	const boardSize = 10;
	const board = ref<Tile[][]>(createBoard());

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
				};

				column.push(tile);
			}

			board.push(column);
		}

		return board;
	}

	// --------------------=

	let selectedTilePositions: { [key: TilePosition["x"]]: TilePosition["y"][] } =
		{};

	function addSelectedTilePositions(pos: TilePosition): void {
		const column = selectedTilePositions[pos.x] ?? [];

		column.push(pos.y);
		selectedTilePositions[pos.x] = column;
	}

	function selectTiles(pos: TilePosition): void {
		const tile = getTile(pos);

		if (!tile || tile.state === "CLEARED") return;

		const adjacentPositions = getLinearAdjacentPositions(pos);

		adjacentPositions.forEach((adjPos) => {
			const adjTile = getTile(adjPos);

			if (!adjTile || adjTile.state !== "IDLE") return;

			if (adjTile.color === tile.color) {
				adjTile.state = "SELECTED";

				addSelectedTilePositions(adjPos);
				selectTiles(adjPos);
			}
		});
	}

	function deselectAllTiles(): void {
		Object.entries(selectedTilePositions).forEach(([column, rows]) => {
			rows.forEach((row) => {
				const tile = getTile({ x: +column, y: row })!;

				tile.state = "IDLE";
			});
		});

		selectedTilePositions = {};
	}

	async function organizeBoard(): Promise<void> {
		const emptyColumns: number[] = [];
		const rowClears: number[] = [];
		let pointsEarned: number = 5;

		Object.entries(selectedTilePositions).forEach(([columnIndex, rows]) => {
			const column = board.value[+columnIndex];
			const organizedColumn: Tile[] = [];
			let clearedTiles: number = 0;

			column.forEach((tile, rowIndex) => {
				if (tile.state === "SELECTED") {
					tile.state = "CLEARED";
					organizedColumn.unshift(tile);
					rowClears.push(rowIndex);

					clearPtsAnim(tile.id, pointsEarned);

					pointsEarned += 10;
					game_state.points += pointsEarned;
				} else {
					organizedColumn.push(tile);
				}

				if (tile.state === "CLEARED") clearedTiles++;
			});

			if (clearedTiles === boardSize) {
				emptyColumns.push(+columnIndex);
			} else {
				board.value[+columnIndex] = organizedColumn;
			}
		});

		[...new Set(rowClears)].forEach((row) => {
			clearRowFlash(row);
		});

		board.value = board.value.filter(
			(column, columnIndex) => !emptyColumns.includes(columnIndex),
		);

		selectedTilePositions = {};

		return;
	}

	// --------------------

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
		// clearSelectedTiles,
		organizeBoard,

		getTile,
		getLinearAdjacentPositions,
	};
});
