import { Component } from '../base/Component';


export interface IGalleryData {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    constructor(container: HTMLElement) {
        super(container);

    }
    
//Заменяет содержимое контейнера галереи массивом элементов карточек
    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}