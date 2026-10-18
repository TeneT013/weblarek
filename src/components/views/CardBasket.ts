import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';

export interface ICardBasket extends ICard {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onDelete: (event: MouseEvent) => void }) {
        super(container);

        // Находим специфичные для элемента корзины поля через ensureElement
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        // Если передан колбэк для удаления, вешаем его на кнопку удаления
        if (actions?.onDelete && this.deleteButton) {
            this.deleteButton.addEventListener('click', actions.onDelete);
        }
    }

    /**
     * Устанавливает порядковый номер строки товара в корзине
     */
    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}