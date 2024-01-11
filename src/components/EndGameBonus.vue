<script setup lang="ts">
const props = defineProps<{
	bonus: number;
}>()
</script>

<template>
	<div class="flex justify-center">
		<span class="text-4xl font-bold">{{ bonus }}</span>
	</div>
</template>
