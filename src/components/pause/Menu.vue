<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

import CloseIcon from "~icons/material-symbols/close-small-rounded";
import RetryIcon from "~icons/material-symbols/replay-rounded";
import PlayIcon from "~icons/material-symbols/play-arrow-rounded";

const emit = defineEmits<{
	close: [];
}>();
</script>

<template>
	<div
		class="modal modal-shadow max-w-[500px]"
		v-on-click-outside="
			() => {
				emit('close');
			}
		"
	>
		<div
			class="flex justify-end rounded-t border-b-4 border-amber-500 bg-amber-400"
		>
			<button type="button" class="m-2 rounded bg-white" @click="emit('close')">
				<CloseIcon class="h-8 w-8" />
			</button>
		</div>

		<div class="menu rounded-b bg-white p-5">
			<div class="settings flex flex-wrap gap-2">
				<button v-for="n in 5" type="button">
					setting {{ n }} <PlayIcon />
				</button>
			</div>

			<hr class="my-5 rounded-full border-t-2 border-neutral-300" />

			<div class="flex gap-3 text-xl">
				<button type="button">RETRY <RetryIcon /></button>
				<button type="button" @click="emit('close')">
					CONTINUE <PlayIcon />
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.menu button {
	@apply flex grow items-center justify-center  gap-2 rounded bg-amber-300 px-4 py-2 font-semibold text-white shadow shadow-black/25 transition-transform hover:-translate-y-1;
}
</style>
