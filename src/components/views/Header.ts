import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, events?: { onClick: () => void }) {
        super(container);

        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

        if (events?.onClick) {
            this.basketButton.addEventListener('click', events.onClick);
        }
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}