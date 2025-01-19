<script setup lang="ts">
import RetryIcon from "~icons/material-symbols/replay-rounded";

const emit = defineEmits<{
	restart: [];
}>();
</script>

<template>
	<div
		class="shadow-subtle fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-5 rounded border-2 border-white bg-red-400 px-4 py-2"
	>
		<span class="text-4xl font-bold text-white">GAME OVER</span>
		<button
			type="button"
			class="shadow-subtle rounded bg-white p-2 text-white transition-transform hover:-translate-y-1"
			@click="emit('restart')"
		>
			<RetryIcon class="h-8 w-8 text-amber-300" />
		</button>
	</div>
</template>
