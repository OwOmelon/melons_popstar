<script setup lang="ts">
const props = defineProps<{
	show: boolean;
}>();
</script>

<template>
	<Teleport to="#modal">
		<Transition name="nested-fade-slide-down">
			<div
				v-if="props.show"
				class="fixed left-0 top-0 z-50 grid h-screen w-screen place-items-center overflow-auto bg-black/10 p-5 backdrop-blur-sm"
			>
				<slot></slot>
			</div>
		</Transition>
	</Teleport>
</template>

<style lang="scss">
.nested-fade-slide-down {
	&-enter-active,
	&-leave-active {
		transition: all 300ms ease-in-out;
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
	}

	&-enter-active .modal,
	&-leave-active .modal {
		transition: all 300ms ease-in-out;
	}

	&-enter-from .modal,
	&-leave-to .modal {
		transform: translateY(-15px);
		opacity: 0.001;
	}
}
</style>

<style scoped lang="postcss">
:slotted(.modal-width) {
	@apply w-[90vw] max-w-[1170px];
}

:slotted(.modal-shadow) {
	@apply shadow-[0_10px_40px] shadow-black/40;
}
</style>
