import { ref, computed } from "vue";
import { defineStore } from "pinia";

export type GameState = "ONGOING" | "WIN" | "LOSE";

export const useGameStateStore = defineStore("game-state", () => {
	const gameover = ref<boolean>(false);

	const points = ref<number>(0);
	const stage = ref<number>(1);
	const goal = ref<number>(1000);

	// !!! REWORK END GAME BONUS LOGIC

	const endGameBonus = ref<number | null>(null);

	const stagePass = computed<boolean>(() => {
		return points.value >= goal.value;
	});

	function addPoints(tilesCleared: number) {
		// !!! CREATE MATH FORMUAL FOR totalPoints
		const inc = 10;
		let pointsGained = 0;

		for (let x = 1; x <= tilesCleared; x++) {
			pointsGained += x * inc;
		}

		points.value += pointsGained;
	}

	function nextStage(): void {
		stage.value++;
		goal.value = goal.value + (stage.value >= 3 ? 3000 : 2000);
	}

	function addEndGameBonus(): void {
		points.value = points.value + (endGameBonus.value ?? 0);
		resetEndGameBonus();
	}

	function resetEndGameBonus(): void {
		endGameBonus.value = 2000;
	}

	function resetState(): void {
		points.value = 0;
		stage.value = 1;
		goal.value = 1000;
		gameover.value = false;
	}

	// --------------------

	return {
		gameover,

		points,
		stage,
		goal,

		endGameBonus,

		stagePass,

		addPoints,
		resetState,
		nextStage,
		addEndGameBonus,
		resetEndGameBonus,
	};
});
