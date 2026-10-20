import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';


// Общие данные любой карточки товара в нашем проекте.
export interface ICard {
    title: string;
    price: number | null;
}

// Базовый класс товарных View. Держит общее: элементы заголовка, цены
// и остатка + их сеттеры. Дочерние классы добавляют своё (кнопку,
// описание) через параметр T.
export abstract class Card<T = object> extends Component<ICard & T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    /**
     * Устанавливает название товара
     */
    set title(value: string) {
        this.titleElement.textContent = value;
    }

    /**
     * Устанавливает цену товара
     */
    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }


}