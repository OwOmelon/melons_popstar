// DISPLAY A HORIZONTAL FLASH ON THE ROW IN WHICH A TILE WAS CLEARED

import type { TileID } from "../stores/board";

const rowFlashes: number[] = [];

export function clearRowFlash(id: TileID) {
	const row = +id[id.length - 1];
	const rowFlashIndex = rowFlashes.indexOf(row);

	if (rowFlashIndex !== -1) return;

	const app = document.getElementById('app')!
	const boardElRect = document.getElementById("board")!.getBoundingClientRect();
	const tileElRect = document.getElementById(id)!.getBoundingClientRect();
	const flash = document.createElement("div");

	flash.classList.add("clear-row-flash", "pointer-events-none", "fixed");

	flash.style.left = `${boardElRect.left}px`;
	flash.style.top = `${tileElRect.top}px`;
	flash.style.width = `${boardElRect.width}px`;
	flash.style.height = `${tileElRect.height}px`;

	rowFlashes.push(row);

	app.append(flash);

	setTimeout(() => {
		flash.remove();
		rowFlashes.splice(rowFlashIndex, 1);
	}, 200);
}
