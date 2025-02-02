import { ref, computed, watch, onMounted } from "vue";
import { defineStore } from "pinia";
import { useFullscreen } from "@vueuse/core";

export const useSettingsStore = defineStore("settings", () => {
	const paused = ref(false);

	// ==========

	const docEl = ref<HTMLElement | null>(null);
	const { isFullscreen, toggle: toggleFullScreen } = useFullscreen(docEl);

	onMounted(() => {
		docEl.value = document.documentElement;
	});

	// ==========

	const userPreferredToggles = ref({
		background_animation: true,
		tile_clear_animation: true,
		board_shake: true,
		column_sorting_animation: true,
	});

	const settings_Toggles = computed(() => {
		return {
			...userPreferredToggles.value,
			full_screen: isFullscreen.value,
		};
	});

	function toggleSetting(key: keyof typeof settings_Toggles.value) {
		if (key === "full_screen") {
			toggleFullScreen();

			return;
		}

		userPreferredToggles.value[key] = !userPreferredToggles.value[key];
	}

	// ==========

	const localStorageKey = "userPreferredToggles";

	function getUserPreferredTogglesFromLocalStorage() {
		const localStorageItem = JSON.parse(
			localStorage.getItem(localStorageKey) || "{}",
		);

		if (localStorageItem && checkUserPreferredToggles(localStorageItem)) {
			userPreferredToggles.value = localStorageItem;
		}
	}

	function checkUserPreferredToggles(
		toggles: typeof userPreferredToggles.value,
	) {
		if (
			typeof toggles !== "object" ||
			Array.isArray(toggles) ||
			toggles === null
		)
			return false;

		const shouldHaveKeys = Object.keys(userPreferredToggles.value);
		const togglesKeys = Object.keys(toggles);

		return shouldHaveKeys.length !== togglesKeys.length
			? false
			: togglesKeys.every((key) => shouldHaveKeys.indexOf(key) !== -1);
	}

	watch(userPreferredToggles, (t) => {
		localStorage.setlocalStorageItem(localStorageKey, JSON.stringify(t));
	});

	onMounted(getUserPreferredTogglesFromLocalStorage);

	// ==========

	return {
		paused,
		settings_Toggles,
		toggleSetting,
	};
});
