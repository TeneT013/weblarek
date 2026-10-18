import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';

// Общие данные любой карточки товара в нашем проекте.
export interface ICard {
    title: string;
    price: number | null;
    category: string;
    image: string;
}

// Базовый класс товарных View. Держит общее: элементы заголовка, цены
// и остатка + их сеттеры. Дочерние классы добавляют своё (кнопку,
// описание) через параметр T.
export abstract class Card<T = object> extends Component<ICard & T> {
    protected categoryElement: HTMLElement | null;
    protected titleElement: HTMLElement;
    protected imageElement: HTMLImageElement | null;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        // Безопасный поиск элементов, которых может не быть в некоторых шаблонах (например, в корзине)
        this.categoryElement = this.container.querySelector('.card__category');
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    protected set title(value: string) {
        this.titleElement.textContent = value;
    }

    protected set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }

    protected set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            this.categoryElement.className = 'card__category';

            const categoryClass = categoryMap[value as keyof typeof categoryMap];
            if (categoryClass) {
                this.categoryElement.classList.add(categoryClass);
            }
        }
    }

    protected set image(src: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, src, this.titleElement.textContent || 'товар');
        }
    }
}