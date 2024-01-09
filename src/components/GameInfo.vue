<script setup lang="ts">
import { useGameStateStore } from "@/stores/game_state";
import GetEndGameBonus from "./GetEndGameBonus.vue";

const game_state = useGameStateStore();
</script>

<template>
	<div class="font-bold">
		<div class="flex justify-evenly">
			<span>stage: {{ game_state.stage }}</span>
			<span>goal: {{ game_state.goal }}</span>
		</div>

		<p
			:class="[
				{ 'bg-amber-500 text-white': game_state.points >= game_state.goal },
				'mx-auto mt-3 w-fit rounded px-4 py-2 text-center text-4xl',
			]"
		>
			{{ game_state.points }}
		</p>

		<GetEndGameBonus
			ref="bonus"
			v-if="game_state.showBonusComponent"
			@bonus="game_state.checkFinalScore"
		/>
	</div>
</template>
