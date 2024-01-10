<script setup lang="ts">
import { useGameStateStore } from "@/stores/game_state";
import PauseIcon from "~icons/solar/pause-bold";

const game_state = useGameStateStore();
</script>

<template>
	<button type="button" @click="game_state.paused = !game_state.paused">
		<PauseIcon />
	</button>
</template>