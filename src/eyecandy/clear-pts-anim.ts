// DISPLAY THE NUMBER OF POINTS OVER A TILE WHEN IT IS CLEARED

import type { TileID } from "../stores/board";

export function clearPtsAnim(id: TileID, points: number): void {
	const app = document.getElementById('app')!
	const tileElRect = document.getElementById(id)!.getBoundingClientRect();
	const ptsAnim = document.createElement("div");
	const ptsAnimText = document.createElement("p");

	ptsAnimText.innerText = points.toString();

	ptsAnim.style.left = `${tileElRect.left}px`;
	ptsAnim.style.top = `${tileElRect.top}px`;
	ptsAnim.style.width = `${tileElRect.width}px`;
	ptsAnim.style.height = `${tileElRect.height}px`;

	ptsAnim.classList.add(
		"pts-anim",
		"pointer-events-none",
		"absolute",
		"grid",
		"place-items-center",
		"text-center",
		"text-xl",
		"font-bold",
	);

	ptsAnim.appendChild(ptsAnimText);

	app.appendChild(ptsAnim);

	setTimeout(() => {
		ptsAnim.remove();
	}, 1000);
}
