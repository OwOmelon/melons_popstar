<script setup lang="ts">
import IconStar from "~icons/material-symbols-light/kid-star";

import type { Tile } from "@/stores/board";

const props = defineProps<Tile>();

const emit = defineEmits<{
	select: [];
	explode: [];
	"force-select": [];
}>();

function onClick(e: MouseEvent): void {
	if (e.ctrlKey) {
		emit("force-select");

		return;
	}

	if (props.state === "SELECTED") {
		emit("explode");
	} else {
		emit("select");
	}
}
</script>

<template>
	<div class="relative">
		<div
			ref="tile"
			:id="id"
			:class="[
				state,
				color,
				'relative grid aspect-square w-10 place-items-center rounded border-[1px] border-transparent text-xs shadow-[0_0_3px] shadow-black/50 duration-150',
			]"
			@click="onClick"
		>
			<IconStar class="absolute h-8 w-8 text-white" />
		</div>
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
	@apply pointer-events-none opacity-0;
}
</style>
