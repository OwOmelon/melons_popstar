<script setup lang="ts">
import Tile from "./Tile.vue";

import { useTemplateRef, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { type OnClickOutsideHandler, onClickOutside } from "@vueuse/core";
import { type BoardPosition, useBoardStore } from "../stores/board";
import { useSettingsStore } from "@/settings/stores/settings";

const emit = defineEmits<{
	"on-tile-clear": [number];
}>();

const { board } = storeToRefs(useBoardStore());
const { deselectTiles, selectTile, organizeBoard } = useBoardStore();

const boardEl = useTemplateRef<HTMLElement>("boardEl");

function onTileSelect(pos: BoardPosition) {
	selectTile(pos);
	addTileDeselectListener();
}

async function onTileClear(e: PointerEvent) {
	emit("on-tile-clear", organizeBoard());
	removeTileDeselectListener(e);
}

let boardEl_ClickOutside_Listener: OnClickOutsideHandler | null = null;

function windowPointerUp_Handler(e: PointerEvent) {
	if (e.button !== 0 || e.target !== boardEl.value) return;

	console.log("BOARD CLICK-SELF: TILE UNSELECT");

	deselectTiles();
	removeTileDeselectListener(e);
}

function addTileDeselectListener() {
	if (boardEl_ClickOutside_Listener) return;

	boardEl.value?.addEventListener("pointerup", windowPointerUp_Handler);

	boardEl_ClickOutside_Listener = onClickOutside(boardEl, (e) => {
		console.log("BOARD CLICK-OUTSIDE: TILE UNSELECT");

		deselectTiles();
		removeTileDeselectListener(e);
	});
}

function removeTileDeselectListener(e: PointerEvent) {
	boardEl_ClickOutside_Listener?.(e);
	boardEl_ClickOutside_Listener = null;
	boardEl.value?.removeEventListener("pointerup", windowPointerUp_Handler);
}

// ==========

const { settings_Toggles } = storeToRefs(useSettingsStore());

function setColumnTransitionProperties() {
	if (!boardEl.value) {
		alert("board el is undefined");

		return;
	}

	let property = "all";
	let duration = "500ms";

	if (!settings_Toggles.value.column_sorting_animation) {
		property = "none";
		duration = "0";
	}

	boardEl.value.style.setProperty("--column-transition-property", property);
	boardEl.value.style.setProperty("--column-transition-duration", duration);
}

watch(
	() => settings_Toggles.value.column_sorting_animation,
	setColumnTransitionProperties,
);

onMounted(setColumnTransitionProperties);
</script>

<template>
	<div
		ref="boardEl"
		id="board"
		class="relative mt-auto flex aspect-square items-center justify-center"
	>
		<TransitionGroup
			v-for="[x, column] in board"
			:key="x"
			tag="div"
			name="column"
			class="column relative flex h-full w-[10%] flex-col gap-[inherit]"
		>
			<Tile
				v-for="(tile, y) in column"
				v-bind="tile"
				:key="tile.id"
				@select="onTileSelect({ x, y })"
				@clear="onTileClear"
			/>
		</TransitionGroup>
	</div>
</template>

<style scoped lang="postcss">
:deep(.TILE) {
	@apply m-[0.18125rem];
}

.column-move,
.column-enter-active,
.column-leave-active {
	transition: var(--column-transition-property)
		var(--column-transition-duration)
		linear(
			0,
			0.115 4.2%,
			0.83 17.2%,
			0.969 21.6%,
			1.045 26.2%,
			1.069 33.4%,
			0.996 58.6%,
			1
		);
}

.column-enter-from,
.column-leave-to {
	opacity: 0;
}

.column-leave-to {
	transform: translate(0, 75%);
}
.column-leave-active {
	position: absolute;
}
</style>
