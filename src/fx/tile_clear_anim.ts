// DISPLAY THE NUMBER OF POINTS OVER A TILE WHEN IT IS CLEARED

import type { TileID } from "../stores/board";

export function tileClearAnim(id: TileID, points: number): void {
	const vfxBoard: HTMLElement = document.getElementById("vfx-board")!;
	const vfxBoardRect: DOMRect = vfxBoard.getBoundingClientRect();

	const tile: HTMLElement = document.getElementById(id)!;
	const tileRect: DOMRect = tile.getBoundingClientRect();

	const fx = createContainer(tileRect, vfxBoardRect);
	const star = createStarSvg(tileRect);
	const pts = createPtsEl(points);
	const animDur: number = 800;

	fx.appendChild(star);
	fx.appendChild(pts);

	vfxBoard.appendChild(fx);

	fx.animate(
		[
			{
				opacity: "1",
				transform: "translateY(0)",
			},
			{
				opacity: "0",
				transform: "translateY(-50px)",
			},
		],
		{ duration: animDur, fill: "forwards", easing: "ease" },
	);

	star.animate(
		[
			{
				transform: "scale(1) rotate(0)",
			},
			{
				transform: "scale(2) rotate(180deg)",
			},
		],
		{ duration: animDur, fill: "forwards", easing: "ease" },
	);

	setTimeout(() => {
		fx.remove();
	}, animDur);
}

function createContainer(
	tileRect: DOMRect,
	vfxBoardRect: DOMRect,
): HTMLElement {
	const div: HTMLDivElement = document.createElement("div");

	div.style.left = `${tileRect.left - vfxBoardRect.left}px`;
	div.style.top = `${tileRect.top - vfxBoardRect.top}px`;

	div.style.width = `${tileRect.width}px`;
	div.style.height = `${tileRect.height}px`;

	div.classList.add(
		"pointer-events-none",
		"absolute",
		"grid",
		"place-items-center",
	);

	return div;
}

function createPtsEl(points: number): HTMLElement {
	const text: HTMLParagraphElement = document.createElement("p");

	text.innerText = points.toString();
	text.classList.add("absolute", "text-xl", "font-bold");

	return text;
}

function createStarSvg(tileRect: DOMRect): SVGSVGElement {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("width", `${tileRect.width}`);
	svg.setAttribute("height", `${tileRect.width}`);
	svg.setAttributeNS(
		"http://www.w3.org/2000/xmlns/",
		"xmlns:xlink",
		"http://www.w3.org/1999/xlink",
	);

	svg.style.position = "absolute";
	svg.style.color = "#fff";
	svg.style.filter = "drop-shadow(0 0 1px rgba(0, 0, 0, 0.75))";

	path.setAttribute("fill", "currentColor");
	path.setAttribute(
		"d",
		"m8.125 7.092l2.608-3.47q.238-.321.566-.472Q11.627 3 12 3q.373 0 .701.15q.328.15.566.471l2.608 3.471l4.02 1.368q.534.18.822.606q.289.425.289.939q0 .237-.07.471q-.07.234-.228.449l-2.635 3.573l.1 3.83q.025.706-.466 1.189q-.492.483-1.144.483l-.453-.056L12 18.733l-4.11 1.211q-.125.05-.24.053q-.117.003-.213.003q-.666 0-1.15-.483q-.485-.483-.46-1.188l.1-3.856l-2.629-3.548q-.159-.217-.228-.453Q3 10.236 3 10q0-.506.297-.942q.296-.435.828-.618z",
	);

	svg.appendChild(path);

	return svg;
}
