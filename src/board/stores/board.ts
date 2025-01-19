import { ref } from "vue";
import { defineStore } from "pinia";

export type TilePosition = {
	x: number;
	y: number;
};

export type TileID = `TILEx${number}y${number}`;
export type TileState = "IDLE" | "SELECTED" | "CLEARED";
export type TileColor = "YELLOW" | "PURPLE" | "BLUE" | "GREEN" | "RED";

export type Tile = {
	readonly id: TileID;
	readonly color: TileColor;
	state: TileState;
};

export const useBoardStore = defineStore("board", () => {
	const boardSize = 10;
	const tilePalette: TileColor[] = ["YELLOW", "PURPLE", "BLUE", "GREEN", "RED"];
	const board = ref<Tile[][]>([]);

	resetBoard();
	function resetBoard() {
		const newBoard: typeof board.value = [];

		for (let columnIndex = 0; columnIndex < boardSize; columnIndex++) {
			const column: Tile[] = [];

			for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
				const tile: Tile = {
					id: `TILEx${columnIndex}y${rowIndex}`,
					color: tilePalette[Math.floor(Math.random() * tilePalette.length)],
					state: "IDLE",
				};

				column.push(tile);
			}

			newBoard.push(column);
		}

		board.value = newBoard;
	}

	// --------------------

	async function unselectSelectedTiles(): Promise<void> {
		board.value.forEach((column) => {
			column.forEach((tile) => {
				if (tile.state === "SELECTED") tile.state = "IDLE";
			});
		});
	}

	async function selectTile(pos: TilePosition) {
		const tile = getTile(pos);

		if (!tile || tile.state === "CLEARED") return;

		getLinearAdjacentPositions(pos).forEach((adjPos) => {
			const adjTile = getTile(adjPos);

			if (
				!adjTile ||
				adjTile.state !== "IDLE" ||
				adjTile.color !== tile.color
			) {
				return;
			}

			adjTile.state = "SELECTED";
			selectTile(adjPos);
		});
	}

	function organizeBoard() {
		const organizedBoard: typeof board.value = [];
		let tilesCleared = 0;

		board.value.forEach((column) => {
			const organizedColumn: typeof column = [];
			let tilesClearedInColumn: number = 0;

			column.forEach((tile) => {
				if (tile.state === "SELECTED") {
					tile.state = "CLEARED";
					organizedColumn.unshift(tile);
					tilesCleared++;
				} else {
					organizedColumn.push(tile);
				}

				if (tile.state === "CLEARED") tilesClearedInColumn++;
			});

			if (tilesClearedInColumn !== boardSize) {
				organizedBoard.push(organizedColumn);
			}
		});

		board.value = organizedBoard;

		return tilesCleared;
	}

	// --------------------

	function getTile(pos: TilePosition): Tile | undefined {
		return board.value?.[pos.x]?.[pos.y];
	}

	function getLinearAdjacentPositions(pos: TilePosition): TilePosition[] {
		return [
			{ x: pos.x, y: pos.y - 1 },
			{ x: pos.x, y: pos.y + 1 },
			{ x: pos.x - 1, y: pos.y },
			{ x: pos.x + 1, y: pos.y },
		];
	}

	function isBoardCleared() {
		for (const [x, column] of Object.entries(board.value)) {
			for (const [y, tile] of Object.entries(column)) {
				if (tile.state !== "IDLE") continue;

				for (const adjPos of getLinearAdjacentPositions({ x: +x, y: +y })) {
					const adjTile = getTile(adjPos);

					if (adjTile?.state === "IDLE" && adjTile?.color === tile.color) {
						return true;
					}
				}
			}
		}

		return false;
	}

	// --------------------

	return {
		boardSize,
		tilePalette,

		board,
		resetBoard,

		unselectSelectedTiles,
		selectTile,
		organizeBoard,

		getTile,
		isBoardCleared,
	};
});
