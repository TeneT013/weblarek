import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface IFormState {
    valid: boolean;
    errors: string | string[];
}

export abstract class Form<T> extends Component<T & IFormState> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;

        // Находим обязательные элементы формы
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        // Обработчик изменения полей ввода (инпутов)
        this.container.addEventListener('input', (event: Event) => {
            const target = event.target;

            // Cужаем тип цели события до HTMLInputElement
            if (target instanceof HTMLInputElement) {
                const field = target.name as keyof T;
                const value = target.value;
                this.onInputChange(field, value);
            }
        });

        // Обработчик сабмита формы
        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(`${this.container.getAttribute('name') || 'form'}:submit`);
        });
    }

    /**
     * Метод для генерации события при изменении конкретного поля
     */
    protected onInputChange(field: keyof T, value: string): void {
        this.events.emit(`${this.container.getAttribute('name') || 'form'}.${String(field)}:change`, {
            field,
            value,
        });
    }

    /**
     * Управляет состоянием доступности кнопки отправки
     */
    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    /**
     * Сеттер обработки и вывода ошибок валидации
     */
    set errors(value: string | string[]) {
        const errorString = Array.isArray(value) ? value.join('; ') : value;
        this.errorsElement.textContent = errorString;
    }
}