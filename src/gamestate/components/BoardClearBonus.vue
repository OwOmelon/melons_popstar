<script setup lang="ts">
import { ref, watch } from "vue";

const { boardClearBonus } = defineProps<{
	boardClearBonus: number;
}>();

const display = ref(0);

watch(
	() => boardClearBonus,
	(b) => {
		if (b === -1) return;

		display.value = b;
	},
);
</script>

<template>
	<div
		:class="[
			{
				'pointer-events-none opacity-0 duration-[1.5s]': boardClearBonus === -1,
			},
			'shadow-subtle mx-auto flex translate-y-9 items-center justify-center gap-4 rounded border-2 border-white bg-lime-300 px-4 py-2 text-white transition-opacity duration-500',
		]"
	>
		bonus:
		<div class="text-4xl font-bold">
			{{ display }}
		</div>
	</div>
</template>
