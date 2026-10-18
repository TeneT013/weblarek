import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Находим поля ввода email и телефона с помощью ensureElement по их атрибуту name
        this.emailInput = ensureElement<HTMLInputElement>('[name=email]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('[name=phone]', this.container);
    }

    /**
     * Устанавливает значение в поле ввода email
     */
    set email(value: string) {
        this.emailInput.value = value;
    }

    /**
     * Устанавливает значение в поле ввода телефона
     */
    set phone(value: string) {
        this.phoneInput.value = value;
    }
}