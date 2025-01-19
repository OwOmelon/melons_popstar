<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useGameStateStore } from "../stores/gamestate";

const { endGameBonus } = storeToRefs(useGameStateStore());

const bonusDisplay = ref(0);

watch(endGameBonus, (val) => {
	if (val === null) return;

	bonusDisplay.value = val;
});
</script>

<template>
	<div
		:class="[
			{ 'pointer-events-none opacity-0': endGameBonus === null },
			'shadow-subtle mx-auto my-4 my-auto flex translate-y-3 items-center justify-center gap-4 rounded border-2 border-white bg-lime-300 px-4 py-2 text-white transition-opacity duration-1000',
		]"
	>
		<span>bonus: </span>
		<span class="text-4xl font-bold">{{ bonusDisplay }}</span>
	</div>
</template>
