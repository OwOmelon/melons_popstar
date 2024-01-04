<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBoardStore } from "@/stores/board";

const emit = defineEmits<{
	bonus: [number];
}>();

const board = useBoardStore();

const bonus = ref<number>(2000);
const subtrahend = ref<number>(20);

async function getEndGameBonus(): Promise<void> {
	const seq1 = [2000, 1980, 1920, 1820, 1680, 1500, 1280, 1020, 720, 380];
	const seq1diff = [20, 60, 100, 140, 180, 220, 260, 300, 340];

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < board.board.length; x++) {
			if (bonus.value <= 0) {
				emit("bonus", bonus.value);

				return;
			}

			const tile = board.getTile({ x, y })!;

			if (tile.state === "IDLE") {
				tile.state = "CLEARED";

				console.log(bonus.value, subtrahend.value)

				bonus.value = bonus.value - subtrahend.value;
				subtrahend.value = subtrahend.value + 40;

				await new Promise((res) => setTimeout(res, 250));
			}
		}
	}
}

onMounted(() => {
	getEndGameBonus();
});

defineExpose({ getEndGameBonus });
</script>

<template>
	<div class="flex justify-center">
		<span class="text-4xl font-bold">{{ bonus }}</span>
	</div>
</template>
