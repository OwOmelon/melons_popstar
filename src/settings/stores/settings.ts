import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { useStorage, useFullscreen } from "@vueuse/core";

export const useSettingsStore = defineStore("settings", () => {
	const paused = ref(false);

	// ==========

	const docEl = ref<HTMLElement | null>(null);

	const { isFullscreen, toggle: toggleFullScreen } = useFullscreen(docEl);

	const settings_Toggles_UserPreferences = useStorage(
		"settings_toggles_userpreferences",
		{
			background_animation: true,
			tile_clear_animation: true,
			board_shake: true,
			column_sorting_animation: true,
		},
	);

	const settings_Toggles = computed(() => {
		return {
			...settings_Toggles_UserPreferences.value,
			full_screen: isFullscreen.value,
		};
	});

	function toggleSetting(key: keyof typeof settings_Toggles.value) {
		if (key === "full_screen") {
			toggleFullScreen();

			return;
		}

		settings_Toggles_UserPreferences.value[key] =
			!settings_Toggles_UserPreferences.value[key];
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
