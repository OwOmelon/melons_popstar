import { ref } from "vue";
import { defineStore } from "pinia";

type Setting =
	| "bg-anim"
	| "tile-select-anim"
	| "tile-clear-anim"
	| "board-shake";

export const useSettingsStore = defineStore("settings", () => {
	const bgAnim = ref<boolean>(true);
	const boardShake = ref<boolean>(true);
	const tileSelectAnim = ref<boolean>(true);
	const tileClearAnim = ref<boolean>(true);

	function toggleSetting(setting: Setting) {
		switch (setting) {
			case "bg-anim":
				bgAnim.value = !bgAnim.value;
				break;

			case "tile-select-anim":
				tileSelectAnim.value = !tileSelectAnim.value;
				break;

			case "tile-clear-anim":
				tileClearAnim.value = !tileClearAnim.value;
				break;

			case "board-shake":
				boardShake.value = !boardShake.value;
				break;
		}
	}

	return { bgAnim, tileSelectAnim, tileClearAnim, boardShake, toggleSetting };
});
