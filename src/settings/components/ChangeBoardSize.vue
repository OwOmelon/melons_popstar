<script setup lang="ts">
import AddIcon from "~icons/streamline/add-1-solid";
import SubtractIcon from "~icons/streamline/subtract-1-solid";
import CheckIcon from "~icons/streamline/check-solid";

const emit = defineEmits<{
	increase: [];
	decrease: [];
	done: [];
}>();
</script>

<template>
	<div
		class="fixed left-1/2 top-1/2 grid grid-cols-2 grid-rows-2 w-[10vw] -translate-x-1/2 -translate-y-1/2 gap-[1vw] rounded-[0.5vw] border-[0.175vw] border-white bg-amber-300 p-[1vw] text-white shadow-[0_10px_40px] shadow-black/40"
	>
		<button type="button" @click="emit('decrease')"><SubtractIcon /></button>
		<button type="button" @click="emit('increase')"><AddIcon /></button>

		<button type="button" class="col-span-2 !aspect-auto" @click="emit('done')">
			<CheckIcon />
		</button>
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply grid aspect-square grow place-items-center rounded-[0.25vw] bg-white text-amber-300 shadow shadow-black/25 transition-transform hover:-translate-y-1;
}

svg {
	@apply h-[1.2vw] w-[1.2vw];
}
</style>
