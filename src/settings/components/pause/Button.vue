<script setup lang="ts">
import PauseIcon from "~icons/solar/pause-bold";

import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/settings/stores/settings";

const { paused } = storeToRefs(useSettingsStore());
</script>

<template>
	<button
		type="button"
		class="rounded bg-amber-300 p-1 text-lg text-white shadow shadow-black/25 transition-transform hover:-translate-y-1 active:scale-90"
		@click="paused = true"
	>
		<PauseIcon />
	</button>
</template>
