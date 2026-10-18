import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';

export interface ICardPreview extends ICard {
    description: string;
}

export class CardPreview extends Card<ICardPreview> {
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container);

        // Находим специфичные для превью элементы через ensureElement
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        // Если передан колбэк для кнопки действия, вешаем обработчик клика
        if (actions?.onClick && this.buttonElement) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    /**
     * Устанавливает текст детального описания товара
     */
    protected set description(value: string) {
        this.textElement.textContent = value;
    }

    /**
     * Изменяет текст на кнопке действия («Купить» / «Удалить из корзины»)
     */
    setButtonText(value: string): void {
        if (this.buttonElement) {
            this.buttonElement.textContent = value;
        }
    }

    /**
     * Блокирует или разблокирует кнопку покупки (если товар недоступен для заказа)
     */
    setButtonDisabled(value: boolean): void {
        if (this.buttonElement) {
            this.buttonElement.disabled = value;
        }
    }
}