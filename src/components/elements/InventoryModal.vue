<script setup>
import { ref, onMounted } from 'vue';
import Button from './ui/Button.vue';
import CloseIconButton from './ui/CloseIconButton.vue';
import Item from './Item.vue';
import Input from './ui/Input.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['close', 'delete', 'mount']);

const modalRef = ref(null);
const amountMode = ref(false);
const inputValue = ref('');

// Фокусируемся на модалке после монтирования
onMounted(() => {
  modalRef.value.focus();
  emit('mount', modalRef.value);
});

const setAmountMode = (value) => {
  amountMode.value = value;
};

const onDelete = () => {
  if (inputValue.value) {
    emit('delete', inputValue.value);
    emit('close', modalRef.value);
    setAmountMode(false);
    inputValue.value = '';
  }
};

// Если нажатие клавиши Escape, то закрываем модалку
const onKeyDown = (event) => {
  if (event.key === 'Escape') {
    emit('close', modalRef.value);
  }
};
</script>

<template>
	<div ref="modalRef" tabindex="-1" class="modal" @keydown="onKeyDown">
		<div class="modal__content">
			<CloseIconButton
				class="close-icon-btn"
				aria-label="Закрыть"
				:height="24"
				:width="24"
				@click="emit('close', modalRef)"
			/>
			<header class="modal__header">
				<Item
					class="modal__item"
					:main-color="item?.mainColor"
					:secondary-color="item?.secondaryColor"
					:width="54"
					:height="54"
				/>
			</header>
			<div class="modal__body">
				<div :class="['desc', {loading: isLoading}]">
					<div class="desc__heading">{{ item?.description.heading }}</div>
					<div class="desc__main">
						<div class="desc__p desc__p1">{{ item?.description.p1 }}</div>
						<div class="desc__p desc__p2">{{ item?.description.p2 }}</div>
						<div class="desc__p desc__p3">{{ item?.description.p3 }}</div>
						<div class="desc__p desc__p4">{{ item?.description.p4 }}</div>
						<div class="desc__p desc__p5">{{ item?.description.p5 }}</div>
					</div>
				</div>
			</div>
			<div class="modal__footer">
				<Button @click="setAmountMode(true)">Удалить предмет</Button>
				<div v-if="amountMode" class="modal__footer-amount-mode">
					<Input id="amount" name="amount" v-model="inputValue" placeholder="Введите количество" />
					<div class="modal__footer-buttons">
						<Button
							class="modal__footer-cancel-btn"
							@click="setAmountMode(false)"
						>
							Отмена
						</Button>
						<Button
							class="modal__footer-apply-btn"
							@click="onDelete"
						>
							Подтвердить
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.modal {
	position: absolute;
	top: 0;
	right: -250px;
	width: 250px;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-top-right-radius: 12px;
	border-bottom-right-radius: 12px;
	border: 1px solid var(--primary-border, #4D4D4D);
	background: rgba(38, 38, 38, 0.50);
	backdrop-filter: blur(8px);
	outline: none;
	transition: right 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);

	.modal__content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;

		.modal__header {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			.modal__item {
				scale: (2.4);
			}
		}

		.modal__body {
			width: 220px;
			height: 208px;
			border-top: 1px solid var(--primary-border, #4D4D4D);
			border-bottom: 1px solid var(--primary-border, #4D4D4D);
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 16px 0 24px;

			.desc {
				.desc__heading {
					width: 211px;
					height: 30px;
					border-radius: 8px;
					margin-bottom: 24px;
				}

				.desc__main {
					display: flex;
					flex-direction: column;
					align-items: center;

					.desc__p:not(:last-child) {
						margin-bottom: 16px;
					}

					.desc__p {
						height: 10px;
						border-radius: 4px;
					}

					.desc__p1, .desc__p2, .desc__p3 {
						width: 211px;
					}

					.desc__p4 {
						width: 180px;
					}

					.desc__p5 {
						width: 80px;
					}
				}
			}

			.desc.loading {
				.desc__heading, .desc__p {
					background: var(--skeleton, linear-gradient(90deg, #3C3C3C 0%, #444 51.04%, #333 100%));
				}
			}
		}

		.modal__footer {
			width: 220px;
			padding: 18.5px 0;
			display: flex;
			justify-content: center;
			align-items: center;

			.modal__footer-amount-mode {
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 133px;
				border-bottom-right-radius: 12px;
				border: 1px solid var(--primary-border, #4D4D4D);
				padding: 18px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				background: rgba(38, 38, 38, 0.60);
				backdrop-filter: blur(8px);

				.modal__footer-buttons {
					display: flex;
					justify-content: space-between;

					.modal__footer-cancel-btn {
						width: 88px;
						color: var(--primary-black, #2D2D2D);
						background: var(--primary-white, #FFFFFF);
					}

					.modal__footer-apply-btn {
						width: 112px;
						color: var(--primary-white, #FFFFFF);
						background: var(--primary-red, #FA7272);
					}
				}
			}
		}
	}
}
</style>
