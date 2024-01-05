import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { useGameStateStore } from "./game_state";
import { clearPtsAnim } from "@/eyecandy/clear-pts-anim";

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
};

export const useBoardStore = defineStore("board", () => {
	const game_state = useGameStateStore();

	// --------------------

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

		let newGrid: ReturnType<typeof createBoard> = [];

		for (let x = 0; x < 10; x++) {
			const newColumn: Tile[] = [];

			for (let y = 0; y < 10; y++) {
				const tile: Tile = {
					id: `spawnx${x}y${y}`,
					color: tilePalette[Math.floor(Math.random() * tilePalette.length)],
					state: "IDLE",
					points: 0,
				};

				newColumn.push(tile);
			}

			newGrid.push(newColumn);
		}

		return newGrid;
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

	function unselectAllTiles(): void {
		board.value.forEach((column) => {
			column.forEach((tile) => {
				if (tile.state === "SELECTED") {
					tile.state = "IDLE";
				}
			});
		});
	}

	function explodeSelectedTiles(): void {
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
		let totalPointsEarned = 0;

		board.value.forEach((column) => {
			const organizedColumn: Tile[] = [];
			let clearedTiles = 0;

			column.forEach((tile) => {
				if (tile.state === "TO_CLEAR") {
					tile.state = "CLEARED";
					clearPtsAnim(tile.id, tile.points);

					totalPointsEarned = totalPointsEarned + tile.points;
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
		game_state.points = game_state.points + totalPointsEarned;

		return;
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
		unselectAllTiles,
		selectTiles,
		explodeSelectedTiles,
		organizeBoard,
		getTile,
		getLinearAdjacentPositions,
	};
});
