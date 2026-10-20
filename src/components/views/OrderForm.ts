import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement, ensureAllElements } from '../../utils/utils';

export interface IOrderForm {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Находим коллекцию кнопок оплаты и инпут адреса
        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('[name=address]', this.container);

        // Обработчики кликов по кнопкам выбора оплаты
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.onInputChange('payment', button.name);
            });
        });
    }

    /**
     * Подсвечивает выбранный способ оплаты, устанавливая активный класс
     */
    set payment(value: string) {
        this.paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    /**
     * Устанавливает значение в поле ввода адреса
     */
    set address(value: string) {
        this.addressInput.value = value;
    }
}