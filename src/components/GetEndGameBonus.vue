<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBoardStore } from "@/stores/board";
import { delay } from "@/composables/delay";

const emit = defineEmits<{
	bonus: [number];
}>();

const board = useBoardStore();

const bonus = ref<number>(2000);
const subtrahend = ref<number>(20);

async function getEndGameBonus(): Promise<void> {
	const delayAmount = 500;

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < board.board.length; x++) {
			const tile = board.getTile({ x, y })!;

			if (tile.state === "IDLE") {
				tile.state = "CLEARED";

				if (bonus.value > 0) {
					bonus.value = bonus.value - subtrahend.value;
					subtrahend.value = subtrahend.value + 40;

					await delay(delayAmount);
				}
			}
		}
	}

	await delay(delayAmount);

	emit("bonus", bonus.value > 0 ? bonus.value : 0);
}

onMounted(async () => {
	await delay(1000);

	getEndGameBonus();
});
</script>

<template>
	<div class="flex justify-center">
		<span class="text-4xl font-bold">{{ bonus }}</span>
	</div>
</template>
