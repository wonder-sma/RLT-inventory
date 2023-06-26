<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import Card from '../components/elements/Card.vue';
import CellTable from '../components/elements/CellTable/CellTable.vue';
import Footer from '../components/elements/Footer.vue';
import Image from '../components/elements/Image.vue';
import InventoryModal from '../components/elements/InventoryModal.vue';
import Main from '../components/layouts/Main.vue';
import Sample from '@/assets/img-blur.png';
import { useInventoryStore } from '../stores/inventory-store';

const inventoryStore = useInventoryStore();
const { cells, items, currentItemId, footerInfo } = storeToRefs(inventoryStore);

onMounted(() => {
  // Инициализация размера инвентаря, если его размер не установлен
  if (!cells.value.length) {
    inventoryStore.initCells(5, 5);
  }

  // Добавление в инвентарь исходного количества предметов, если инвентарь пуст
  let isEmpty = true;

  for (let value of items.value.values()) {
    if (value.count) {
      isEmpty = false;
    }
  }

  if (isEmpty) {
    let id;

    id = cells.value[0][0].id;
    inventoryStore.addItem(id, {
      col: 0,
      row: 0,
      count: 4,
      mainColor: '#7FAA65',
      secondaryColor: '#B8D998',
      description: {},
    });

    id = cells.value[0][1].id;
    inventoryStore.addItem(id, {
      col: 0,
      row: 0,
      count: 2,
      mainColor: '#AA9765',
      secondaryColor: '#D9BB98',
      description: {},
    });

    id = cells.value[0][2].id;
    inventoryStore.addItem(id, {
      col: 0,
      row: 0,
      count: 5,
      mainColor: '#656CAA',
      secondaryColor: '#7481ED',
      description: {},
    });
  }
});

const onClickOnItem = (id) => {
  inventoryStore.setCurrentItemId(id);
};

const onCloseModal = (modal) => {
  modal.style.right = '-250px';
  setTimeout(() => inventoryStore.setCurrentItemId(''), 300);
};

const onDeleteItem = (amount) => {
  inventoryStore.setItemAmount(amount);
};

const onModalMounted = (modal) => {
  modal.style.right = 0;
};
</script>

<template>
	<Main>
		<aside>
			<Card :description="{}" :is-loading="true">
				<Image
					:src="Sample"
					alt="sample image"
					width="208px"
					height="240px"
				/>
			</Card>
		</aside>
		<main class="main">
			<CellTable :cells="cells" :items="items" @click="onClickOnItem" />
			<InventoryModal
				v-if="currentItemId"
				:item="items.get(currentItemId)"
				:is-loading="true"
				@close="onCloseModal"
				@delete="onDeleteItem"
				@mount="onModalMounted"
			/>
		</main>
		<Footer :info="footerInfo" :is-loading="true" />
	</Main>
</template>

<style lang="scss" scoped>
.main {
	position: relative;
	border-radius: 12px;
	overflow: clip;
}
</style>
