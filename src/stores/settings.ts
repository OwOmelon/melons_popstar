import { ref } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

type Setting =
	| "bg-anim"
	| "tile-select-anim"
	| "tile-clear-anim"
	| "board-shake";

export const useSettingsStore = defineStore("settings", () => {
	const bgAnim = useStorage("bg-anim", true);
	const boardShake = useStorage("board-shake", true);
	const tileSelectAnim = useStorage("tile-select-anim", true);
	const tileClearAnim = useStorage("tile-clear-anim", true);

	function toggleSetting(setting: Setting) {
		switch (setting) {
			case "bg-anim":
				bgAnim.value = !bgAnim.value;
				break;

			case "board-shake":
				boardShake.value = !boardShake.value;
				break;

			case "tile-select-anim":
				tileSelectAnim.value = !tileSelectAnim.value;
				break;

			case "tile-clear-anim":
				tileClearAnim.value = !tileClearAnim.value;
				break;
		}
	}

	return { bgAnim, tileSelectAnim, tileClearAnim, boardShake, toggleSetting };
});
