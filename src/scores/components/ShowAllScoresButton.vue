<script setup lang="ts">
import IconList from "~icons/material-symbols/list-alt-outline";

import { storeToRefs } from "pinia";
import { useScoresStore } from "../stores/scores";

const { showAllScores } = storeToRefs(useScoresStore());
</script>

<template>
	<button
		@click="showAllScores = !showAllScores"
		class="rounded bg-amber-300 p-1 text-lg text-white shadow shadow-black/25 transition-transform hover:-translate-y-1 active:scale-90"
	>
		<IconList />
	</button>
</template>
