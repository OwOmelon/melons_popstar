<script setup lang="ts">
import RetryIcon from "~icons/material-symbols/replay-rounded";

const emit = defineEmits<{
	restart: [];
}>();
</script>

<template>
	<div class="flex gap-5 items-center justify-center">
		<span class="text-4xl font-bold ">GAME OVER</span>
		<button
			type="button"
			class="shadow-subtle rounded bg-amber-300 p-2 text-white transition-transform hover:-translate-y-1"
			@click="emit('restart')"
		>
			<RetryIcon class="h-8 w-8" />
		</button>
	</div>
</template>

<style scoped lang="postcss">
.score-details {
	@apply flex flex-col items-center
}
span {
	@apply block;
}
</style>
