<script setup lang="ts">
import Tile from "./Tile.vue";

import { useTemplateRef } from "vue";
import { storeToRefs } from "pinia";
import { type OnClickOutsideHandler, onClickOutside } from "@vueuse/core";
import { type BoardPosition, useBoardStore } from "../stores/board";

const emit = defineEmits<{
	"on-tile-clear": [number];
}>();

const { board } = storeToRefs(useBoardStore());
const { deselectTiles, selectTile, organizeBoard } = useBoardStore();

const boardEl = useTemplateRef<HTMLElement>("boardEl");

function onTileSelect(pos: BoardPosition) {
	deselectTiles();
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
</script>

<template>
	<div
		ref="boardEl"
		id="board"
		class="relative flex items-center justify-center gap-[0.3625rem] rounded p-2 mt-auto"
	>
		<div
			v-for="(column, x) in board"
			class="relative flex flex-col gap-[inherit]"
		>
			<Tile
				v-for="(tile, y) in column"
				v-bind="tile"
				:key="tile.id"
				@select="onTileSelect({ x, y })"
				@clear="onTileClear"
			/>
		</div>
	</div>
</template>
