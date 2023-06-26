import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

const INVENTORY_STORE_KEY = 'RLT-inventory';

const getFromLocalStorage = key => {
  const jsonData = localStorage.getItem(key);

  if (jsonData) {
    return JSON.parse(jsonData);
  }

  return null;
};

const setToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useInventoryStore = defineStore('inventoryStore', () => {

    // Состояние инвентаря
    const cells = ref(getFromLocalStorage(INVENTORY_STORE_KEY)?.cells || []);
    const items = ref(new Map(getFromLocalStorage(INVENTORY_STORE_KEY)?.items || []));
    const currentItemId = ref('');
    const footerInfo = ref('');

    // Инициализация размера инвентаря
    const initCells = (colCount, rowCount) => {
      for (let i = 0; i < rowCount; i++) {
        const row = Array.from({ length: colCount }, (_, index) => {
          const id = uuidv4();
          items.value.set(id, { col: index, row: i });

          return { id };
        });

        cells.value.push(row);
      }
    };

    // Установка текущего выбранного предмета
    const setCurrentItemId = (id) => {
      if (id && items.value.get(id).count) {
        currentItemId.value = id;
      } else {
        currentItemId.value = '';
      }
    };

    // Добавление предмета в инвентарь
    const addItem = (id, item) => items.value.set(id, item);

    // Изменение количества предмета или его полное удаление
    const setItemAmount = (amount) => {
      const currentItem = items.value.get(currentItemId.value);

      if (amount >= currentItem.count) {
        items.value.set(currentItemId.value, { col: currentItem.col, row: currentItem.row });
      } else {
        items.value.set(currentItemId.value, { ...currentItem, count: currentItem.count - amount });
      }
    };

    watch([cells, items], ([cells, items]) => {
      setToLocalStorage(INVENTORY_STORE_KEY, {
        cells: cells,
        items: Array.from(items.entries()),
      });
    }, { deep: true });

    return {
      cells,
      items,
      currentItemId,
      footerInfo,
      initCells,
      setCurrentItemId,
      addItem,
      setItemAmount,
    };
  },
);
