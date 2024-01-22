<script setup lang="ts">
import { computed } from "vue";
import { useGameStateStore } from "@/stores/game_state";

const game_state = useGameStateStore();

const opacity = computed(() => {
	return game_state.gameover ? "opacity-20" : "opacity-75";
});
</script>

<template>
	<div
		:class="[
			game_state.gameover ? 'bg-slate-700' : 'bg-amber-100',
			'pointer-events-none absolute left-0 top-0 z-[-5] h-screen w-screen overflow-hidden transition-colors duration-1000',
		]"
	>
		<div
			class="absolute left-0 top-0 grid h-full w-full rotate-[10deg] place-items-center"
		>
			<div
				:class="[
					opacity,
					'bg-image scrollX absolute h-[200%] w-[200%] transition-opacity duration-1000',
				]"
			/>
		</div>

		<div
			:class="[
				opacity,
				'absolute bottom-0 left-1/2 h-1/2 w-[200%] -translate-x-1/2 bg-gradient-to-t from-white transition-opacity duration-1000',
			]"
		/>
	</div>
</template>

<style scoped lang="postcss">
.bg-image {
	background-image: url(../assets/circle.svg);
	background-size: 26px;
}

.scrollX {
	animation: scrollX 2s infinite linear;
}

@keyframes scrollX {
	from {
		transform: translate(13px, 13px);
	}

	to {
		transform: translate(-13px, -13px);
	}
}
</style>
