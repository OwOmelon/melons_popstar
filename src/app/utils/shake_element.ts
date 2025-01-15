const options: KeyframeAnimationOptions = { duration: 100, fill: "forwards" };
const keyframes = [
	{
		transform: "translateX(2px) translateY(-2px)",
	},
	{
		transform: "translateX(-2px) translateY(-2px)",
	},
	{
		transform: "translateX(1px) translateY(1px)",
	},
	{
		transform: "translateX(-1px) translateY(1px)",
	},
	{
		transform: "translateX(3px) translateY(-3px)",
	},
	{
		transform: "translateX(-3px) translateY(-3px)",
	},
];

export function shakeElement(el: HTMLElement) {
	if (!el) {
		alert("ELEMENT IS UNDEFINED");

		return;
	}

	el.animate(keyframes, options);
}
