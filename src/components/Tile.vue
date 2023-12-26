<script setup lang="ts">
import type { Tile } from "@/stores/board";

const props = defineProps<Tile>();

const emit = defineEmits<{
	"explode-tile": [];
}>();
</script>

<template>
	<div
		:class="[
			state,
			color,
			'grid aspect-square w-10 place-items-center rounded border-[1px] border-transparent border-white text-xs',
		]"
		@click="emit('explode-tile')"
	>
		<p>O</p>
	</div>
</template>

<style scoped lang="postcss">
.YELLOW {
	@apply bg-[#FFF18E];
}

.PURPLE {
	@apply bg-[#DDAAFF];
}

.BLUE {
	@apply bg-[#B0EDFC];
}

.GREEN {
	@apply bg-[#ADFF9B];
}

.RED {
	@apply bg-[#FF84A5];
}

.EXPLODE {
	@apply border-black;
}

.CLEARED {
	@apply opacity-25;
}
</style>
