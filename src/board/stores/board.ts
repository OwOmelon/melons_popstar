import { ref } from "vue";
import { defineStore } from "pinia";

export type BoardPosition = {
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
	const board = ref<Map<BoardPosition["x"], Tile[]>>(new Map());

	resetBoard();
	function resetBoard() {
		const newBoard: typeof board.value = new Map();

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

			newBoard.set(columnIndex, column);
		}

		board.value = newBoard;
	}

	// --------------------

	const selectedTilesMap: Map<BoardPosition["x"], BoardPosition["y"][]> =
		new Map();

	function addBoardPostionToSelectedTilesMap(pos: BoardPosition) {
		selectedTilesMap.set(pos.x, [
			...(selectedTilesMap.get(pos.x) ?? []),
			pos.y,
		]);
	}

	function deselectTiles() {
		selectedTilesMap.forEach((rows, column) => {
			rows.forEach((row) => {
				const tile = getTile({ x: column, y: row })!;

				tile.state = "IDLE";
			});
		});

		selectedTilesMap.clear();
	}

	function selectTile(pos: BoardPosition) {
		if (selectedTilesMap.size) deselectTiles();

		recurse(pos);

		function recurse(p: BoardPosition) {
			const tile = getTile(p);

			if (!tile || tile.state === "CLEARED") return;

			getLinearAdjacentPositions(p).forEach((adjPos) => {
				const adjTile = getTile(adjPos);

				if (
					!adjTile ||
					adjTile.state !== "IDLE" ||
					adjTile.color !== tile.color
				) {
					return;
				}

				adjTile.state = "SELECTED";
				addBoardPostionToSelectedTilesMap(adjPos);
				recurse(adjPos);
			});
		}
	}

	function organizeBoard() {
		const organizedBoard: typeof board.value = new Map();
		let tilesCleared = 0;

		board.value.forEach((column, x) => {
			if (!selectedTilesMap.has(x)) {
				organizedBoard.set(x, column);

				return;
			}

			const organizedColumn: typeof column = [];
			let column_ClearedTilesCount: number = 0;

			column.forEach((tile) => {
				if (tile.state === "SELECTED") {
					tile.state = "CLEARED";
					organizedColumn.unshift(tile);
					tilesCleared++;
				} else {
					organizedColumn.push(tile);
				}

				if (tile.state === "CLEARED") column_ClearedTilesCount++;
			});

			if (column_ClearedTilesCount !== boardSize) {
				organizedBoard.set(x, organizedColumn);
			}
		});

		board.value = organizedBoard;
		selectedTilesMap.clear();

		return tilesCleared;
	}

	// --------------------

	function getTile(pos: BoardPosition): Tile | undefined {
		return board.value.get(pos.x)?.[pos.y];
	}

	function getLinearAdjacentPositions(pos: BoardPosition): BoardPosition[] {
		const xIndeces = Array.from(board.value.keys());
		const xIndex = xIndeces.indexOf(pos.x);

		return [
			{ x: pos.x, y: pos.y - 1 },
			{ x: pos.x, y: pos.y + 1 },
			{ x: xIndeces[xIndex - 1], y: pos.y },
			{ x: xIndeces[xIndex + 1], y: pos.y },
		];
	}

	function isBoardCleared() {
		for (const [x, column] of board.value) {
			for (const [y, tile] of Object.entries(column)) {
				if (tile.state !== "IDLE") continue;

				for (const adjPos of getLinearAdjacentPositions({ x: x, y: +y })) {
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

		deselectTiles,
		selectTile,
		organizeBoard,

		getTile,
		getLinearAdjacentPositions,
		isBoardCleared,
	};
});
