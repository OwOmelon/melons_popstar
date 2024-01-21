<template>
	<div class="absolute left-0 top-0 z-[-5] h-screen w-screen overflow-hidden">
		<div
			class="absolute left-0 top-0 grid h-full w-full rotate-[10deg] place-items-center"
		>
			<div class="bg-image scrollX opacity-75 absolute h-[200%] w-[200%]" />
		</div>

		<div
			class="border-2/ absolute -top-[20%] left-1/2 h-1/2 w-[200%] -translate-x-1/2 rotate-[-10deg] border-black bg-gradient-to-b from-amber-100 via-amber-100 via-75%"
		/>

		<div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-1/2 bg-gradient-to-t from-white/75" />
	</div>
</template>

<style scoped>
.bg-image {
	background-image: url(../assets/circle.svg);
	background-size: 26px;
}

.scrollX {
	animation: scrollX 2s infinite linear;
}

@keyframes scrollX {
	from {
		transform: translate(13px, 13px);
	}

	to {
		transform: translate(-13px, -13px);
	}
}

.scroll {
	animation: scrollY 2s infinite linear;
}

@keyframes scrollY {
	from {
		transform: translateY(13px);
	}

	to {
		transform: translateY(-13px);
	}
}
</style>
