const options: KeyframeAnimationOptions = { duration: 100 };
const shakeKeyframes = [
	[
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
		{
			transform: "translateX(0) translateY(0)",
		},
	],
	[
		{
			transform: "translateX(-2px) translateY(2px)",
		},
		{
			transform: "translateX(2px) translateY(2px)",
		},
		{
			transform: "translateX(-1px) translateY(-1px)",
		},
		{
			transform: "translateX(1px) translateY(-1px)",
		},
		{
			transform: "translateX(-3px) translateY(3px)",
		},
		{
			transform: "translateX(3px) translateY(3px)",
		},
		{
			transform: "translateX(0) translateY(0)",
		},
	],
];

export function shakeElement(el: HTMLElement) {
	if (!el) {
		alert("ELEMENT IS UNDEFINED");

		return;
	}

	el.animate(
		shakeKeyframes[Math.floor(Math.random() * shakeKeyframes.length)],
		options,
	);
}
