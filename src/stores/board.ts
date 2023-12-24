import { ref, computed } from "vue";
import { defineStore } from "pinia";

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
		setTimeout(() => {
			const organizedBoard: Tile[][] = [];

			board.value.forEach((column, columnIndex) => {
				const organizedColumn: Tile[] = [];
				let clearedTiles = 0;

				column.forEach((tile) => {
					if (tile.state === "EXPLODE") {
						tile.state = "CLEARED";

						organizedColumn.unshift(tile);
					} else {
						organizedColumn.push(tile);
					}

					if (tile.state === "CLEARED") clearedTiles++;
				});

				console.log(columnIndex, clearedTiles);

				if (clearedTiles !== column.length) {
					organizedBoard.push(organizedColumn);
				} else {
				}
			});

			board.value = organizedBoard;
		}, 500);
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

	// ------------------------------

	return { board, createBoard, explodeTile, organizedBoard };
});
