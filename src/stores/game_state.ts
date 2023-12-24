import { ref } from "vue";
import { defineStore } from "pinia";

export type GameState = "ONGOING" | "WIN" | "LOSE";

export const useGameStateStore = defineStore("game-state", () => {
	const points = ref<number>(0);
	const goal = ref<number>(0);

	const state = ref<GameState>("ONGOING");

	const organizingBoard = ref<boolean>(false);

	return {
		points,
		goal,
		state,
		organizingBoard,
	};
});
