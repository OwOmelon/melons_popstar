// DISPLAY THE NUMBER OF POINTS WHEN CLEARING A TILE ON SAID TILE

import type { TileID } from '@/stores/board'

export function clearPtsAnim(id: TileID, points: number): void {
		const tileEl = document.getElementById(id);

		if (!tileEl) return;

		const tileElRect = tileEl.getBoundingClientRect();
		const ptsAnim = document.createElement("div");
		const ptsAnimText = document.createElement("p");

		ptsAnimText.innerText = points.toString();

		ptsAnim.style.left = `${tileElRect.left}px`;
		ptsAnim.style.top = `${tileElRect.top}px`;
		ptsAnim.style.width = `${tileElRect.width}px`;
		ptsAnim.style.height = `${tileElRect.height}px`;

		ptsAnim.setAttribute("id", `pts-anim${id}`);
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

		ptsAnim.appendChild(ptsAnimText)
		document.body.appendChild(ptsAnim);

		// REMOVE ELEMENT IN 200MS AFTER ANIMATION (pts-anim) FINISHES
		setTimeout(() => {
			ptsAnim.remove();
		}, 1000);
	}