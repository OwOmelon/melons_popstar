import { ref } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

type Setting =
	| "bg-anim"
	| "tile-select-anim"
	| "tile-clear-anim"
	| "board-shake";

export const useSettingsStore = defineStore("settings", () => {
	const paused = ref(false)

	// !!! REWORK TOGGLES

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

	const changingBoardSize = ref<boolean>(false);
	const areaFontSize = ref(16)

	function changeBoardSize(operation: "inc" | "dec"): void {
		const el = document.getElementById('area')!;
		const vfxDiv = document.getElementById('vfx')!
		const operand = operation === "inc" ? 2 : -2;

		areaFontSize.value += operand

		el.style.fontSize = `${areaFontSize.value}px`;
		vfxDiv.style.fontSize = `${areaFontSize.value}px`;
	}

	return {
		paused,

		bgAnim,
		tileSelectAnim,
		tileClearAnim,
		boardShake,
		toggleSetting,

		changingBoardSize,
		changeBoardSize,
	};
});
