<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

const { settings_Toggles, changingBoardSize } = storeToRefs(useSettingsStore());
const { toggleSetting } = useSettingsStore();
</script>

<template>
	<div class="settings flex flex-col gap-2">
		<div
			v-for="({ displayName, toggled }, settingsKey, _) in settings_Toggles"
			class="flex grow items-center justify-between gap-2"
			@click="toggleSetting(settingsKey)"
		>
			{{ displayName }}

			<div
				:class="[
					toggled ? 'justify-end bg-amber-300' : 'justify-start bg-neutral-300',
					'shadow-subtle flex h-5 w-10 cursor-pointer rounded-full bg-amber-400 p-[2px]',
				]"
			>
				<div class="aspect-square h-full rounded-full bg-white" />
			</div>
		</div>

		<button
			type="button"
			class="shadow-subtle mr-auto mt-3 rounded bg-amber-300 px-3 py-1 text-white transition-transform hover:-translate-y-1"
			@click="changingBoardSize = true"
		>
			change board size
		</button>
	</div>
</template>
