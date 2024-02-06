<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
	points: number;
	goal: number;
	stage: number;
	stagePass: boolean;
}>();

const key = ref<number>(0);
const pointsGained = ref<number>(0);

watch(
	() => props.points,
	(newPts, oldPts) => {
		if (newPts === 0) return;

		key.value++;
		pointsGained.value = newPts - oldPts;
	},
);
</script>

<template>
	<div class="relative flex justify-between px-5 font-bold">
		<span>stage: {{ stage }}</span>

		<span
			:class="[
				{
					'shadow-subtle shine !border-white bg-amber-400 text-white':
						stagePass,
				},
				'absolute left-1/2 top-1/2 mx-auto w-fit -translate-x-1/2 -translate-y-1/2 rounded border-2 border-transparent px-4 py-2 text-center text-[2.5em] transition-colors',
			]"
		>
			{{ points }}
		</span>

		<div class="relative">
			<span>goal: {{ goal }}</span>

			<div
				:class="[
					stagePass ? 'w-[120%]' : 'w-0',
					'absolute left-1/2 top-1/2 h-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black transition-[width]',
				]"
			/>
		</div>

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

.shine {
	background-image: linear-gradient(
		to right,
		rgba(255, 255, 255, 0) 0%,
		rgba(255, 255, 255, 1) 10%,
		rgba(255, 255, 255, 0) 20%,
		rgba(255, 255, 255, 0) 1000%
	);
	background-size: 200% 100%;
	background-repeat: no-repeat;

	animation: shine 5s linear infinite;
}

@keyframes shine {
	0% {
		background-position: 50% 0;
	}

	25%,
	100% {
		background-position: -400% 0;
	}
}
</style>
