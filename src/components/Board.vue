<script setup lang="ts">
import { ref } from "vue";
import { useBoardStore } from "@/stores/board";

const board = useBoardStore();
</script>

<template>
	<div class="flex gap-2">
		<div class="flex flex-col gap-2" v-for="column in board.board">
			<div
				v-for="tile in column"
				:style="{ backgroundColor: tile.color }"
				class="grid place-items-center aspect-square w-10 rounded text-xs"
			>
				<p>{{ tile.pos.x }} | {{ tile.pos.y }}</p>
			</div>
		</div>
	</div>
</template>
