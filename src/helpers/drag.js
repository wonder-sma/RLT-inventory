import { drop } from './drop.js';
import Cursor from '@/assets/clarity_cursor-hand-grab-line.svg';

export const drag = (event, element, moveCb) => {
  // Рассчитываем сдвиг курсора относительно элемента
  const { top, left } = element.getBoundingClientRect();
  const shiftY = event.pageY - top;
  const shiftX = event.pageX - left;

  let isDragStart = false;
  const clonedElement = element.cloneNode(true);

  const moveAt = (top, left) => {
    clonedElement.style.top = top - shiftY + 'px';
    clonedElement.style.left = left - shiftX + 'px';
  };

  // Обработчик события движения курсора
  function onMouseMove(event) {
    // При первом сдвиге курсора добавляем склонированный элемент на страницу и задаем ему положение
    if (!isDragStart) {
      document.body.append(clonedElement);
      clonedElement.style.position = 'absolute';
      clonedElement.style.zIndex = 999;
      clonedElement.style.border = '1px solid var(--primary-border, #4D4D4D)';
      clonedElement.style.borderRadius = '24px';
      clonedElement.style.background = 'var(--secondary-bg, #262626)';
      clonedElement.style.cursor = `url(${Cursor}), pointer`;

      isDragStart = true;
    }

    // Перемещаем элемент на позицию курсора
    moveAt(event.pageY, event.pageX);
  }

  // Добавляем обработчик движения курсора на страницу
  document.addEventListener('mousemove', onMouseMove);

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseup', onMouseUp);
  };

  // Добавляем обработчик отжатия кнопки мыши на элемент, чтобы удалить обработчик движения курсора при отсутствии
  // склонированного элемента
  element.addEventListener('mouseup', onMouseUp);

  const onMouseUpCloned = (event) => {
    document.removeEventListener('mousemove', onMouseMove);
    clonedElement.removeEventListener('mouseup', onMouseUpCloned);

    const targetCellId = drop(event, clonedElement);

    // Если перемещение в ячейку было совершено и есть id целевой ячейки, то вызываем callback
    if (targetCellId) {
      moveCb(targetCellId);
    }
  };

  // Добавляем обработчик отжатия кнопки мыши на склонированный элемент
  clonedElement.addEventListener('mouseup', onMouseUpCloned);
};
