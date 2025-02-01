<script setup lang="ts">
import type { ScoreDisplay } from "./Scores.vue";

const { score } = defineProps<{
	score: ScoreDisplay;
}>();
</script>

<template>
	<li
		class="flex items-center gap-5 whitespace-nowrap rounded bg-white/75 px-3 py-2 pt-3 shadow-sm w-[97%]"
	>
		<div class="w-7 text-center">{{ score.rank }}.</div>

		<div>
			<div class="text-xs font-light leading-none">
				{{
					typeof score.datePublished === "string"
						? new Date(+score.datePublished.slice(3)).toLocaleString()
						: score.datePublished.custom
				}}
			</div>

			<div class="text-lg font-bold">
				{{ score.value }}
			</div>
		</div>
	</li>
</template>
