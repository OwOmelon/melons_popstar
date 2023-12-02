<script setup lang="ts">
import type { Tile } from "@/stores/board";

const props = defineProps<Tile>();
</script>

<template>
	<div
		:style="{ backgroundColor: color }"
		class="grid aspect-square w-10 place-items-center rounded text-xs"
	>
		<p>{{ pos.x }} | {{ pos.y }}</p>
	</div>
</template>
