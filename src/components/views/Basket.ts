import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    buttonDisabled: boolean;
}

export class Basket extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        // Находим необходимые элементы разметки корзины
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        // Вешаем обработчик клика на кнопку перехода к оформлению заказа
            this.buttonElement.addEventListener('click', () => {
                this.events.emit('order:open');
            });
    }

    /**
     * Обновляет список товаров в корзине.
     */
    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
    }

    /**
     * Устанавливает и отображает итоговую стоимость всех товаров
     */
    set total(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }

    /**
     * Блокирует или разблокирует кнопку оформления заказа
     */
    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}