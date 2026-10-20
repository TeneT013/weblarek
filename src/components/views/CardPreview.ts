import { Card, ICard } from "./Card";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from '../base/Events';

export interface ICardPreview extends ICard {
  category: string;
  image: {
    src: string;
    alt: string;
  };
  description: string;
  buttonText?: string;
  buttonDisabled?: boolean;
}

export class CardPreview extends Card<ICardPreview> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected textElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.textElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit('card:action')
    });
  
  }

  /**
   * Устанавливает категорию товара
   */
  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = "card__category";

    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  /**
   * Устанавливает изображение товара
   */
  set image(value: { src: string; alt: string }) {
    this.setImage(this.imageElement, value.src, value.alt);
  }

  /**
   * Устанавливает текст детального описания товара
   */
  set description(value: string) {
    this.textElement.textContent = value;
  }

  /**
   * Изменяет текст на кнопке действия («Купить» / «Удалить из корзины»)
   */
  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  /**
   * Блокирует или разблокирует кнопку покупки (если товар недоступен для заказа)
   */
  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}
