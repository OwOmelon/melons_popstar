<script setup lang="ts">
import Tile from "./Tile.vue";

import { useTemplateRef } from "vue";
import { storeToRefs } from "pinia";
import { type OnClickOutsideHandler, onClickOutside } from "@vueuse/core";
import { type TilePosition, useBoardStore } from "../stores/board";
import { shakeElement } from "@/app/utils/shake_element";

const emit = defineEmits<{
	"on-tile-clear": [number];
}>();

const { board } = storeToRefs(useBoardStore());
const { deselectTiles, selectTile, organizeBoard } = useBoardStore();

const boardEl = useTemplateRef<HTMLElement>("boardEl");

function onTileSelect(pos: TilePosition) {
	deselectTiles();
	selectTile(pos);
	addTileDeselectListener();
}

async function onTileClear() {
	emit("on-tile-clear", organizeBoard());

	if (boardEl.value) shakeElement(boardEl.value);
}

let boardEl_ClickOutside_Listener: OnClickOutsideHandler | null = null;

function windowPointerUp_Handler(e: PointerEvent) {
	if (e.button !== 0 || e.target !== boardEl.value) return;

	console.log("BOARD CLICK-SELF: TILE UNSELECT");

	deselectTiles();
	removeTileDeselectListener(e);
}

function addTileDeselectListener() {
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
		class="relative flex items-center justify-center gap-2 gap-[0.3625rem] rounded p-2"
	>
		<div
			v-for="(column, x) in board"
			class="relative flex w-10 flex-col gap-[inherit]"
		>
			<Tile
				v-for="(tile, y) in column"
				v-bind="tile"
				:key="tile.id"
				@select="onTileSelect({ x, y })"
				@explode="onTileClear"
			/>
		</div>
	</div>
</template>
