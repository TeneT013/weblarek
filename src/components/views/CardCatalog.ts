import { Card, ICard } from "./Card";
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';


export interface ICardCatalog extends ICard {
    category: string;
    image: {
        src: string;
        alt: string;
    };
}

export class CardCatalog extends Card<ICardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }
    
    /**
     * Устанавливает категорию товара
     */
    set category(value: string) {
            this.categoryElement.textContent = value;
            this.categoryElement.className = 'card__category';

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
}