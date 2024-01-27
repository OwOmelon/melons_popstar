<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import Setting from "./Setting.vue";

const settings = useSettingsStore();
</script>

<template>
	<div class="settings flex flex-col gap-2">
		<Setting
			text="background animation"
			:toggled="settings.bgAnim"
			@toggle="settings.toggleSetting('bg-anim')"
		/>
		<Setting
			text="star select animation"
			:toggled="settings.tileSelectAnim"
			@toggle="settings.toggleSetting('tile-select-anim')"
		/>
		<Setting
			text="star clear animation"
			:toggled="settings.tileClearAnim"
			@toggle="settings.toggleSetting('tile-clear-anim')"
		/>
		<Setting
			text="board shake"
			:toggled="settings.boardShake"
			@toggle="settings.toggleSetting('board-shake')"
		/>
	</div>
</template>
