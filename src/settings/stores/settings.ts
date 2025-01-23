import { ref } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

type SettingKey = "bgAnim" | "tileClearAnim" | "boardShake";

export const useSettingsStore = defineStore("settings", () => {
	const paused = ref(false);

	const settings_Toggles = useStorage<
		Record<SettingKey, { displayName: string; toggled: boolean }>
	>("settings_toggles", {
		bgAnim: { displayName: "background animation", toggled: true },
		tileClearAnim: { displayName: "tile clear animation", toggled: true },
		boardShake: { displayName: "board shake", toggled: true },
	});

	function toggleSetting(key: SettingKey) {
		settings_Toggles.value[key].toggled = !settings_Toggles.value[key].toggled;
	}

	const changingBoardSize = ref<boolean>(false);
	const areaFontSize = ref(16);

	function changeBoardSize(operation: "inc" | "dec"): void {
		const el = document.getElementById("area")!;
		const vfxDiv = document.getElementById("vfx")!;
		const operand = operation === "inc" ? 2 : -2;

		areaFontSize.value += operand;

		el.style.fontSize = `${areaFontSize.value}px`;
		vfxDiv.style.fontSize = `${areaFontSize.value}px`;
	}

	return {
		paused,
		settings_Toggles,

		toggleSetting,

		changingBoardSize,
		changeBoardSize,
	};
});
