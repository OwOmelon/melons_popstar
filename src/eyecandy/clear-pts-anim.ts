// DISPLAY THE NUMBER OF POINTS OVER A TILE WHEN IT IS CLEARED

import type { TileID } from "../stores/board";

export function clearPtsAnim(id: TileID, points: number): void {
	const vfxBoard: HTMLElement = document.getElementById("vfx-board")!;
	const pts: HTMLElement = createPtsEl();
	const animDur: number = 800;

	vfxBoard.appendChild(pts);

	pts.animate(
		[
			{
				opacity: "1",
				transform: "translateY(0)",
			},
			{
				opacity: "0",
				transform: "translateY(-20px)",
			},
		],
		{ duration: animDur, fill: "forwards", easing: 'ease' },
	);

	setTimeout(() => {
		pts.remove();
	}, animDur);

	function createPtsEl(): HTMLElement {
		const vfxBoardRect: DOMRect = vfxBoard.getBoundingClientRect();
		const tileRect: DOMRect = document
			.getElementById(id)!
			.getBoundingClientRect();

		const div: HTMLDivElement = document.createElement("div");
		const text: HTMLParagraphElement = document.createElement("p");

		div.style.left = `${tileRect.left - vfxBoardRect.left}px`;
		div.style.top = `${tileRect.top - vfxBoardRect.top}px`;

		div.style.width = `${tileRect.width}px`;
		div.style.height = `${tileRect.height}px`;

		div.classList.add(
			"pointer-events-none",
			"absolute",
			"text-xl",
			"font-bold",
		);

		text.innerText = points.toString();
		text.classList.add(
			"absolute",
			"left-1/2",
			"top-1/2",
			"-translate-x-1/2",
			"-translate-y-1/2",
		);

		div.appendChild(text);

		return div;
	}
}
