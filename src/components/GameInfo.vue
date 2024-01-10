<script setup lang="ts">
import { ref, watch } from "vue";
import { useGameStateStore } from "@/stores/game_state";

const game_state = useGameStateStore();

const key = ref<number>(0)
const pointsGained = ref<number>(0);

watch(
	() => game_state.points,
	(newPts, oldPts) => {
		key.value++
		pointsGained.value = newPts - oldPts;
	},
);
</script>

<template>
	<div class="relative flex justify-between px-5 font-bold">
		<span>stage: {{ game_state.stage }}</span>

		<span
			:class="[
				{ 'bg-amber-500/ text-white/': game_state.points >= game_state.goal },
				'absolute left-1/2 top-1/2 mx-auto w-fit -translate-x-1/2 -translate-y-1/2 rounded px-4 py-2 text-center text-4xl',
			]"
		>
			{{ game_state.points }}
		</span>

		<span>goal: {{ game_state.goal }}</span>

		<div
			class="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-[calc(50%_-_2rem)] place-items-center"
		>
			<span :key="key" class="jump absolute whitespace-nowrap text-xl">
				+ {{ pointsGained }}
			</span>
		</div>
	</div>
</template>

<style scoped>
.jump {
	animation: jump 1s ease forwards;
}

@keyframes jump {
	0%,
	50% {
		transform: translateY(0);
	}

	25% {
		transform: translateY(-0.5rem);
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}
</style>
