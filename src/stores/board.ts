import { ref, computed } from "vue";
import { defineStore } from "pinia";

export type TilePosition = {
	x: number;
	y: number;
};

export type TileState = "IDLE" | "FOCUSED" | "EXPLODED";

export type Tile = {
	readonly pos: TilePosition;
	readonly color: string;
	state: TileState;
};

export const useBoardStore = defineStore("board", () => {
	const board = ref<Tile[][]>([]);

	createBoard();
	function createBoard(): void {
		const tilePalette = ["#FFF18E", "#DDAAFF", "#B0EDFC", "#ADFF9B", "#FF84A5"];

		let newGrid: Tile[][] = [];

		for (let x = 0; x < 10; x++) {
			const newColumn: Tile[] = [];

			for (let y = 0; y < 10; y++) {
				const tile: Tile = {
					pos: { x, y },
					state: "IDLE",
					color: tilePalette[Math.floor(Math.random() * tilePalette.length)],
				};

				newColumn.push(tile);
			}

			newGrid.push(newColumn);
		}

		board.value = newGrid;
	}

	function focusTile(pos: TilePosition): void {
		const tile = getTile(pos);

		if (!tile || tile.state === "EXPLODED") return;

		const adjacentTiles = getLinearAdjacentTiles(pos);

		adjacentTiles.forEach((adjTile) => {
			if (adjTile.state === "IDLE" && adjTile.color === tile.color) {
				adjTile.state = "FOCUSED";

				focusTile(adjTile.pos);
			}
		});
	}

	function explodeFocusedTiles(): void {
		board.value.forEach((column) => {
			column.forEach((tile) => {
				if (tile.state === "FOCUSED") {
					tile.state = "EXPLODED";
				}
			});
		});
	}

	function tileIsExplodable(tile: Tile, adjTiles: Tile[]): boolean {
		return adjTiles.some(
			(adjTile) => adjTile.state === "IDLE" && adjTile?.color === tile.color,
		);
	}

	function getTile(pos: TilePosition): Tile | null {
		return board.value?.[pos.x]?.[pos.y] ?? null;
	}

	function getLinearAdjacentTiles(pos: TilePosition): Tile[] {
		const adjacentTiles: Tile[] = [];
		const linearAdjacentPositions = [
			{ x: pos.x, y: pos.y - 1 },
			{ x: pos.x, y: pos.y + 1 },
			{ x: pos.x - 1, y: pos.y },
			{ x: pos.x + 1, y: pos.y },
		];

		linearAdjacentPositions.forEach((pos) => {
			const tile = getTile(pos);

			if (tile) adjacentTiles.push(tile);
		});

		return adjacentTiles;
	}

	return { board, createBoard, focusTile };
});
