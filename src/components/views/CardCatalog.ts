import { Card } from "./Card";

export class CardCatalog extends Card {
    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container);

        // Если передан колбэк для клика, вешаем его на корневой элемент карточки
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }
}