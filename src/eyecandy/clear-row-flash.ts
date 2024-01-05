export function clearRowFlash(rowIndeces: number[]): void {
	const clearRowFlashBoardEl = document.getElementById(
		"clear-row-flash-board",
	)!;

	rowIndeces.forEach((rowIndex) => {
		const flash = document.createElement("div");

		flash.style.gridRowStart = (rowIndex + 1).toString();
		flash.classList.add("clear-row-flash");

		clearRowFlashBoardEl.append(flash);

		// REMOVE FLASH IN 100MS AFTER ITS ANIMATION FINISHES
		setTimeout(() => {
			flash.remove();
		}, 1000 + 100);
	});
}
