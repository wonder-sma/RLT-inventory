<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: false,
  },
});
const emit = defineEmits(['click']);
</script>

<template>
	<ul class="list">
		<li
			class="list__item"
			v-for="item in data"
			:key="item[0]"
			tabindex="0"
			:title="item[1].value"
			@click="emit('click', item[0])"
		>
			<p>{{ item[1].value }}</p>
		</li>
	</ul>
</template>

<style lang="scss" scoped>
.list {
	width: 100%;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	list-style: none;

	.list__item {
		width: 100%;
		min-height: 3rem;
		display: flex;
		align-items: center;
		border: 1px solid #d1d5db;
		border-radius: 0.25rem;
		padding: 0.4rem 0.8rem;
		outline: none;
		cursor: pointer;
		transition: all .3s;

		&:hover {
			color: #3b82f6;
			border-color: #3b82f6;
		}

		&:focus {
			color: #1d4ed8;
			border-color: #1d4ed8;
		}

		p {
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
	}
}
</style>
