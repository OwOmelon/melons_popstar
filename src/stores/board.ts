import { ref, computed } from "vue";
import { defineStore } from "pinia";

export type TileState = "IDLE" | "EXPLODED";

export type Tile = {
  pos: {
    x: number;
    y: number;
  };
  state: TileState;
  color: string;
};

export const useBoardStore = defineStore("board", () => {
  const board = ref<Tile[][]>([]);

  createBoard()
  function createBoard(): void {
    const tilePalette = ["#FFF18E", "#DDAAFF", "#B0EDFC", "#ADFF9B", "#FF84A5"];

    let newGrid: Tile[][] = [];

    for (let x = 0; x < 10; x++) {
      const newColumn: Tile[] = [];

      newGrid.push(newColumn);

      for (let y = 0; y < 10; y++) {
        const tile: Tile = {
          pos: { x, y },
          state: "IDLE",
          color: tilePalette[Math.floor(Math.random() * tilePalette.length)],
        };

        newGrid[x].push(tile);
      }
    }

    board.value = newGrid;
  }

  return { board };
});
