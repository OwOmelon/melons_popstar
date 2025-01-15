<script setup lang="ts">
const emit = defineEmits<{
	toggle: [];
}>();

const props = defineProps<{
	text: string;
	toggled: boolean;
}>();
</script>

<template>
	<label
		class="flex grow items-center justify-between gap-2"
		@click="emit('toggle')"
	>
		{{ text }}

		<div
			:class="[
				toggled ? 'justify-end bg-amber-300' : 'justify-start bg-neutral-300',
				'flex shadow-subtle h-5 w-10 cursor-pointer rounded-full bg-amber-400 p-[2px]',
			]"
		>
			<div class="aspect-square h-full rounded-full bg-white" />
		</div>
	</label>
</template>
