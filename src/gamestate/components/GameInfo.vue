<script setup lang="ts">
import { useTemplateRef, watch } from "vue";
import { storeToRefs } from "pinia";
import { useGameStateStore } from "../stores/gamestate";

const { points, goal, stage, stagePass } = storeToRefs(useGameStateStore());

const pointsGainedEl = useTemplateRef<HTMLElement>("pointsGainedEl");

watch(points, (newPts, oldPts) => {
	if (newPts === 0 || !pointsGainedEl.value) return;

	pointsGainedEl.value.classList.remove("jump");

	setTimeout(() => {
		pointsGainedEl.value!.classList.add("jump");
	}, 0);

	pointsGainedEl.value.innerText = `+ ${newPts - oldPts}`;
});
</script>

<template>
	<div class="relative flex justify-between px-5 font-bold">
		<span>stage: {{ stage }}</span>

		<span
			:class="[
				{
					'shadow-subtle glint !border-white bg-amber-400 text-white':
						stagePass,
				},
				'absolute left-1/2 top-1/2 mx-auto w-fit -translate-x-1/2 -translate-y-1/2 rounded border-2 border-transparent px-4 py-2 text-center text-[2.25em] transition-colors',
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
			<span
				ref="pointsGainedEl"
				class="absolute whitespace-nowrap text-xl opacity-0"
			/>
		</div>
	</div>
</template>

<style scoped>
.jump {
	animation: jump 1s forwards;
}

@keyframes jump {
	0% {
		transform: translateY(1rem);
	}

	25% {
		transform: translateY(0);
		opacity: 1;
	}

	100% {
		transform: translateY(0);
		opacity: 0;
	}
}

.glint {
	background-image: linear-gradient(
		to right,
		rgba(255, 255, 255, 0) 0%,
		rgba(255, 255, 255, 1) 10%,
		rgba(255, 255, 255, 0) 20%,
		rgba(255, 255, 255, 0) 1000%
	);
	background-size: 200% 100%;
	background-repeat: no-repeat;

	animation: glint 5s linear infinite;
}

@keyframes glint {
	0% {
		background-position: 50% 0;
	}

	25%,
	100% {
		background-position: -400% 0;
	}
}
</style>
