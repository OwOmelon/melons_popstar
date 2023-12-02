<script setup lang="ts">
import type { Tile } from "@/stores/board";

const props = defineProps<Tile>();

const emit = defineEmits<{
	"explode-tile": [];
}>();
</script>

<template>
	<div
		:style="{ backgroundColor: color }"
		:class="[
			// {'exploded': exploded},
			state,
			'grid aspect-square w-10 place-items-center rounded text-xs border-2 border-transparent',
		]"
		@click="emit('explode-tile')"
	>
		<p>{{ pos.x }} | {{ pos.y }}</p>
	</div>
</template>

<style scoped lang="postcss">
.exploded, .FOCUSED {
	@apply border-black;
}
</style>
