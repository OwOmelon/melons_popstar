<script setup lang="ts">
import ScoreComp from "./Score.vue";
import ShowAllScoresButton from "./ShowAllScoresButton.vue";

import { computed } from "vue";
import { storeToRefs } from "pinia";
import { type Score, useScoresStore } from "../stores/scores";

// MAN I JUST LOVE TO COMPLICATE THINGS, DON'T I
export type ScoreDisplay = {
	[Key in keyof Score]: Key extends "datePublished"
		? Score["datePublished"] | { custom: string }
		: Score[Key];
} & { rank: number };

const props = defineProps<{
	currentScore: number;
}>();

const { scores, showAllScores } = storeToRefs(useScoresStore());

const currentScore = computed<ScoreDisplay>(() => {
	return {
		id: "S:CURRENT",
		datePublished: { custom: "-- NOW --" },
		value: props.currentScore,
		rank: 0,
	};
});

const display = computed<ScoreDisplay[]>(() => {
	const scoresAndCurr = [...scores.value, currentScore.value].toSorted(
		(a, b) => b.value - a.value,
	);

	if (showAllScores.value) {
		return scoresAndCurr.map((s, index) => {
			return { ...s, rank: index + 1 };
		});
	}

	const currIndex = scoresAndCurr.findIndex(
		(s) => s.id === currentScore.value.id,
	);

	// -----

	const toReturn = [{ ...currentScore.value, rank: currIndex + 1 }];

	for (let x = 1; x <= 4; x++) {
		const index = currIndex - x;
		const scoreSide = scoresAndCurr[index];

		if (!scoreSide) break;

		toReturn.unshift({ ...scoreSide, rank: index + 1 });
	}

	return toReturn;
});
</script>

<template>
	<div
		v-if="scores.length"
		:class="[
			`${showAllScores ? 'show' : 'hide'}-all-scores`,
			'absolute top-12 z-50 flex w-60 flex-col gap-3 rounded border-2 border-white bg-white/25 p-3 backdrop-blur transition-[opacity,_transform] duration-1000 lg:right-[calc(100%_+_0.5rem)]',
		]"
	>
		<div class="flex items-center justify-between text-2xl font-bold">
			SCORES

			<ShowAllScoresButton class="hidden lg:block" />
		</div>

		<TransitionGroup
			tag="ul"
			name="list"
			class="relative w-full overflow-y-scroll rounded"
		>
			<ScoreComp v-for="score in display" :key="score.id" :score="score" />
		</TransitionGroup>
	</div>
</template>

<style scoped lang="postcss">
@media only screen and (max-width: 1023px) {
	.hide-all-scores {
		@apply -translate-x-full opacity-0;
	}
}

.show-all-scores {
	height: calc(100% - 6rem);
}

ul {
	scrollbar-width: thin;
	scrollbar-gutter: stable both-edges;
	scrollbar-color: theme(colors.amber.400) rgba(255, 255, 255, 0.75);
}

ul li {
	@apply mb-1;
}

ul li:last-child {
	@apply mb-0;
}

.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 1s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
}

.list-leave-to {
	transform: translate(0, 75%);
}
.list-leave-active {
	position: absolute;
}
</style>
