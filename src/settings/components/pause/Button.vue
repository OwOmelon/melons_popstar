<script setup lang="ts">
import PauseIcon from "~icons/solar/pause-bold";

import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/settings/stores/settings";

const { paused } = storeToRefs(useSettingsStore());
</script>

<template>
	<button type="button" @click="paused = true">
		<PauseIcon />
	</button>
</template>
