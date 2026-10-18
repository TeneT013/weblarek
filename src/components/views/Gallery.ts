import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IGalleryData {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        // Если сама галерея и есть контейнер для карточек, либо ищем селектор внутри
        this.catalogElement = ensureElement<HTMLElement>(this.container);
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}