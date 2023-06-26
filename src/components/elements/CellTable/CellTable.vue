<script setup>
import Cell from './Cell.vue';
import Item from '../Item.vue';

const props = defineProps({
  cells: {
    type: Array,
    required: true,
  },
  items: {
    type: Map,
    required: true,
  },
});
const emit = defineEmits(['click']);
</script>

<template>
	<div class="cell-table">
		<div class="cell-table__row" v-for="(cellRow, rowIndex) in cells" :key="rowIndex">
			<Cell
				v-for="cell in cellRow"
				:key="cell.id"
				:count="items.get(cell.id).count"
				@click="emit('click', cell.id)"
			>
				<Item
					v-if="items.get(cell.id).mainColor"
					:main-color="items.get(cell.id).mainColor"
					:secondary-color="items.get(cell.id).secondaryColor"
					:width="54"
					:height="54"
				/>
			</Cell>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.cell-table {
	border-radius: 12px;
	border: 1px solid var(--primary-border, #4D4D4D);
	display: flex;
	flex-direction: column;
	overflow: clip;

	.cell-table__row {
		display: flex;

		&:not(:last-child) {
			border-bottom: 1px solid var(--primary-border, #4D4D4D);
		}
	}
}
</style>
