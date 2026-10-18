import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected closeButton: HTMLButtonElement;
    protected totalElement: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        // Находим кнопку закрытия и элемент для вывода суммы списанных средств
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);

        // Привязываем колбэк к клику по кнопке возврата в каталог
        if (actions?.onClick && this.closeButton) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
    }

    /**
     * Устанавливает и выводит итоговую сумму списанных средств
     */
    set total(value: number) {
        this.totalElement.textContent = `Списано ${value} синапсов`;
    }
}