<script setup lang="ts">
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
	<div
		:class="[
			state,
			color,
			'grid aspect-square w-10 place-items-center rounded border-[1px] border-transparent border-white text-xs',
		]"
		@click="onClick"
	>
		<p>{{ points }}</p>
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
	@apply border-black;
}

.EXPLODING {
	@apply border-red-600;
}

.CLEARED {
	@apply pointer-events-none opacity-25;
}

/* MISC */

.pts-anim {
	animation: pts-anim 500ms linear forwards;
}

@keyframes pts-anim {
	from {
		opacity: 1;
		transform: translateY(0);
	}

	to {
		opacity: 0;
		transform: translateY(-20px);
	}
}
</style>
