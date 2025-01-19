<script setup lang="ts">
import Tile from "./Tile.vue";

import { useTemplateRef } from "vue";
import { storeToRefs } from "pinia";
import { type TilePosition, useBoardStore } from "../stores/board";
import { shakeElement } from "@/app/utils/shake_element";

const emit = defineEmits<{
	"on-tile-clear": [number];
}>();

const { board } = storeToRefs(useBoardStore());
const { unselectSelectedTiles, selectTile, organizeBoard } = useBoardStore();

const boardEl = useTemplateRef<HTMLElement>("boardEl");

function onTileSelect(pos: TilePosition) {
	unselectSelectedTiles();
	selectTile(pos);
}

async function onTileClear() {
	emit("on-tile-clear", organizeBoard());

	if (boardEl.value) shakeElement(boardEl.value);
}

window.addEventListener("mousedown", (e) => {
	if (
		e.target &&
		(e.target === boardEl.value || !boardEl.value?.contains(e.target as Node))
	) {
		unselectSelectedTiles();

		console.log(e.target);
	}
});
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
