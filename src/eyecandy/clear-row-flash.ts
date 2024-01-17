// DISPLAY A HORIZONTAL FLASH ON THE ROW IN WHICH A TILE WAS CLEARED

import type { TileID } from "../stores/board";

export function clearRowFlash(row: number) {
	const vfxBoard = document.getElementById("vfx-board")!;
	const flash = createFlashEl();

	vfxBoard.append(flash);

	flash.animate(
		[
			{
				backgroundSize: "100% 100%",
			},
			{
				backgroundSize: "10000% 100%",
			},
		],
		{ duration: 500, iterations: Infinity, easing: "ease" },
	);

	setTimeout(() => {
		flash.remove();
	}, 200);

	function createFlashEl(): HTMLElement {
		const div = document.createElement("div");

		div.style.gridRowStart = `${row + 1}`;
		div.style.gridColumn = "span 10 / span 10";

		div.style.backgroundPosition = "center";
		div.style.backgroundSize = "100% 100%";
		div.style.backgroundRepeat = "no-repeat";
		div.style.backgroundImage = `linear-gradient(
    		to right,
    		rgba(255, 255, 255, 1) 0%,
    		rgba(255, 255, 255, 1) 45%,
    		rgba(255, 255, 255, 0) 50%,
    		rgba(255, 255, 255, 1) 55%,
    		rgba(255, 255, 255, 1) 1000%
  		)`;

		return div;
	}
}
