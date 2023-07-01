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
    const inventory = ref(new Map(getFromLocalStorage(INVENTORY_STORE_KEY)?.inventory || []));
    const currentItemId = ref('');
    const footerInfo = ref('');

    // Инициализация размера инвентаря
    const initCells = (colCount, rowCount) => {
      for (let i = 0; i < rowCount; i++) {
        const row = Array.from({ length: colCount }, (_, index) => {
          const id = uuidv4();
          inventory.value.set(id, { col: index, row: i });

          return { id };
        });

        cells.value.push(row);
      }
    };

    // Установка текущего выбранного предмета
    const setCurrentItemId = (id) => {
      if (id && inventory.value.get(id).count) {
        currentItemId.value = id;
      } else {
        currentItemId.value = '';
      }
    };

    // Добавление предмета в инвентарь
    const addItem = (id, item) => inventory.value.set(id, item);

    // Изменение количества выбранного предмета или его полное удаление
    const setItemAmount = (amount) => {
      const currentItem = inventory.value.get(currentItemId.value);

      if (amount >= currentItem.count) {
        inventory.value.set(currentItemId.value, { col: currentItem.col, row: currentItem.row });
      } else {
        inventory.value.set(currentItemId.value, { ...currentItem, count: currentItem.count - amount });
      }
    };

    // Перемещение предмета в кол-ве 1 шт. в другую ячейку инвентаря
    const moveItem = (currentCellId, targetCellId) => {
      // console.log(currentCellId, targetCellId);
      let currentCell = inventory.value.get(currentCellId);

      if (currentCell.count) {
        // Обновляем данные о текущей ячейке
        inventory.value.set(currentCellId, { ...currentCell, count: currentCell.count - 1 });

        const targetCell = inventory.value.get(targetCellId);

        // Обновляем данные о целевой ячейке
        inventory.value.set(targetCellId, {
          ...inventory.value.get(currentCellId),
          col: targetCell.col,
          row: targetCell.row,
          count: targetCell.count ? (targetCell.count + 1) : 1,
        });
      }

      // Обновляем данные о текущей ячейке в переменной после изменений
      currentCell = inventory.value.get(currentCellId);

      // Проверяем, что если текущая ячейка стала пуста от элементов, то обнуляем ее
      if (!currentCell.count) {
        inventory.value.set(currentCellId, { col: currentCell.col, row: currentCell.row });
      }
    };

    watch([cells, inventory], ([cells, inventory]) => {
      setToLocalStorage(INVENTORY_STORE_KEY, {
        cells: cells,
        inventory: Array.from(inventory.entries()),
      });
    }, { deep: true });

    return {
      cells,
      inventory,
      currentItemId,
      footerInfo,
      initCells,
      setCurrentItemId,
      addItem,
      setItemAmount,
      moveItem,
    };
  },
);
