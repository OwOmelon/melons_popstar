import { ref } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { v4 as uuid } from "uuid";

export type Score = {
	datePublished: `TS:${string}`;
	id: `S:${string}`;
	value: number;
};

export const useScoresStore = defineStore("scores", () => {
	const scores = useStorage<Score[]>("popstar_scores", []);
	const showAllScores = ref(false);

	function saveScore(scoreValue: Score["value"]) {
		scores.value.push({
			datePublished: `TS:${new Date().getTime()}`,
			id: `S:${uuid()}`,
			value: scoreValue,
		});
	}

	function deleteScore(id: Score["id"]) {
		scores.value = scores.value.filter((s) => s.id !== id);
	}

	return { scores, showAllScores, saveScore, deleteScore };
});
