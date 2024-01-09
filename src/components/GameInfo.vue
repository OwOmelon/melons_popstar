<script setup lang="ts">
import { useGameStateStore } from "@/stores/game_state";
import GetEndGameBonus from "./GetEndGameBonus.vue";

const game_state = useGameStateStore();
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

		<GetEndGameBonus
			ref="bonus"
			v-if="game_state.showBonusComponent"
			@bonus="game_state.checkFinalScore"
		/>
	</div>
</template>
