<script setup lang="ts">
const { boardClearBonus } = defineProps<{
	boardClearBonus: number;
}>();
</script>

<template>
	<Transition name="fade">
		<div
			v-if="boardClearBonus !== -1"
			class="shadow-subtle mx-auto my-4 my-auto flex translate-y-3 items-center justify-center gap-4 rounded border-2 border-white bg-lime-300 px-4 py-2 text-white"
		>
			<span>bonus: </span>
			<span class="text-4xl font-bold">{{ boardClearBonus }}</span>
		</div>
	</Transition>
</template>
