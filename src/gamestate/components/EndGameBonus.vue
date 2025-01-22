<script setup lang="ts">
const { boardClearBonus } = defineProps<{
	boardClearBonus: number;
}>();
</script>

<template>
	<div
		:class="[
			{ 'pointer-events-none opacity-0': boardClearBonus === -1 },
			'shadow-subtle mx-auto my-4 my-auto flex translate-y-3 items-center justify-center gap-4 rounded border-2 border-white bg-lime-300 px-4 py-2 text-white transition-opacity duration-1000',
		]"
	>
		<span>bonus: </span>
		<span class="text-4xl font-bold">{{ boardClearBonus }}</span>
	</div>
</template>
