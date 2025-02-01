import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { useStorage, useFullscreen } from "@vueuse/core";

type SettingKey = "bgAnim" | "tileClearAnim" | "boardShake" | "fullScreen";
type Settings_Toggles = Record<
	SettingKey,
	{ displayName: string; toggled: boolean }
>;

export const useSettingsStore = defineStore("settings", () => {
	const paused = ref(false);

	// ==========

	const docEl = ref<HTMLElement | null>(null);

	const { isFullscreen, toggle: toggleFullScreen } = useFullscreen(docEl);

	const settings_Toggles_UserPreferences = useStorage<
		Partial<Settings_Toggles>
	>("settings_toggles", {
		bgAnim: { displayName: "background animation", toggled: true },
		tileClearAnim: { displayName: "tile clear animation", toggled: true },
		boardShake: { displayName: "board shake", toggled: true },
	});

	const settings_Toggles = computed(() => {
		return {
			...settings_Toggles_UserPreferences.value,
			fullScreen: { displayName: "full screen", toggled: isFullscreen.value },
		} as Settings_Toggles;
	});

	function toggleSetting(key: SettingKey) {
		if (key === "fullScreen") {
			toggleFullScreen();

			return;
		}

		const setting = settings_Toggles.value[key];

		if (!setting) return;

		setting.toggled = !setting.toggled;
	}

	onMounted(() => {
		docEl.value = document.documentElement;
	});

	return {
		paused,
		settings_Toggles,
		toggleSetting,
	};
});
