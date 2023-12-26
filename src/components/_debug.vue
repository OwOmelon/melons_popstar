<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { UseDraggable as Draggable } from "@vueuse/components";
import { useBoardStore } from "@/stores/board";
import { useGameStateStore } from "@/stores/game_state";

const show = ref<boolean>(true);

function toggleShow(e: KeyboardEvent): void {
	const condition = e.altKey && e.ctrlKey && e.shiftKey;

	if (!condition) return;

	switch (e.key) {
		case "S":
			show.value = !show.value;
			break;
	}
}

onMounted(() => {
	window.addEventListener("keydown", toggleShow);
});

// --------------------

const board = useBoardStore();
const state = useGameStateStore();

const dragHandle = ref<HTMLElement | null>(null);
</script>

<template>
	<Draggable
		v-if="show"
		:initial-value="{ x: 30, y: 30 }"
		:handle="dragHandle"
		class="fixed flex min-w-[400px] flex-col gap-3 rounded border-[1px] border-white bg-black/50 p-3 text-xs text-white backdrop-blur-sm"
	>
		<div ref="handle" class="absolute left-0 top-0 h-5 w-full bg-white" />

		<p>man what the fuck</p>
	</Draggable>
</template>
