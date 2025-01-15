<script setup lang="ts">
import Setting from "./Setting.vue";

import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

const { toggleSetting } = useSettingsStore();
const { bgAnim, tileSelectAnim, tileClearAnim, boardShake, changingBoardSize } =
	storeToRefs(useSettingsStore());
</script>

<template>
	<div class="settings flex flex-col gap-2">
		<Setting
			text="background animation"
			:toggled="bgAnim"
			@toggle="toggleSetting('bg-anim')"
		/>
		<Setting
			text="star select animation"
			:toggled="tileSelectAnim"
			@toggle="toggleSetting('tile-select-anim')"
		/>
		<Setting
			text="star clear animation"
			:toggled="tileClearAnim"
			@toggle="toggleSetting('tile-clear-anim')"
		/>
		<Setting
			text="board shake"
			:toggled="boardShake"
			@toggle="toggleSetting('board-shake')"
		/>

		<button
			type="button"
			class="shadow-subtle mr-auto mt-3 rounded bg-amber-300 px-3 py-1 text-white transition-transform hover:-translate-y-1"
			@click="changingBoardSize = true"
		>
			change board size
		</button>
	</div>
</template>
