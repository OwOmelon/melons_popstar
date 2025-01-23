<script setup lang="ts">
import IconStar from "~icons/material-symbols-light/kid-star";

import type { Tile } from "../stores/board";

const props = defineProps<Tile>();

const emit = defineEmits<{
	select: [];
	clear: [PointerEvent];
}>();

function onPointerUp(e: PointerEvent): void {
	switch (props.state) {
		case "IDLE":
			emit("select");
			break;

		case "SELECTED":
			emit("clear", e);
			break;
	}
}
</script>

<template>
	<div
		:id="id"
		:class="[
			state,
			color,
			'relative grid aspect-square w-10 place-items-center rounded border-[0.125rem] border-transparent shadow-[0_0_0.25rem] shadow-black/50',
		]"
		@pointerdown.prevent="onPointerUp"
	>
		<IconStar
			class="absolute h-full w-full text-white drop-shadow-[0_0_0.25rem_rgba(0,0,0,0.2)]"
		/>
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

/* STATES */

/* .SELECTED {
	@apply scale-[1.1] border-white brightness-125;
} */

.SELECTED {
	@apply border-white;
}

.EXPLODING {
	@apply border-red-600;
}

.CLEARED {
	@apply opacity-0;
}
</style>
