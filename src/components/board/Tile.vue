<script setup lang="ts">
import IconStar from "~icons/material-symbols-light/kid-star";

import type { Tile } from "@/stores/board";

const props = defineProps<
	Tile & {
		selectTransition: boolean;
	}
>();

const emit = defineEmits<{
	select: [];
	explode: [];
}>();

function onClick(): void {
	if (props.state === "SELECTED") {
		emit("explode");
	} else {
		emit("select");
	}
}
</script>

<template>
	<div
		:id="id"
		:class="[
			{ 'transition-[transform,_border-color,_filter]': selectTransition },
			state,
			color,
			'relative grid aspect-square place-items-center rounded border-2 border-[1px] border-black border-transparent   shadow-[0_0_3px] shadow-black/50',
		]"
		@click="onClick"
	>
		<IconStar
			class="absolute h-full w-full text-white drop-shadow-[0_0_3px_rgba(0,0,0,0.2)]"
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

.SELECTED {
	@apply scale-[1.1] border-white brightness-125;
}

.EXPLODING {
	@apply border-red-600;
}

.CLEARED {
	@apply opacity-0;
}
</style>
