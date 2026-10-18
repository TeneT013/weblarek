import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

// Данные модалки — готовый DOM-элемент, который нужно показать.
interface IModalData {
  content: HTMLElement;
}

// VIEW — модальное окно. Универсальный контейнер:
// в .modal__content кладётся любой готовый DOM-элемент (например, форма).
// Закрывается по кнопке и по клику на оверлей (клик внутри окна гасится).
export class Modal extends Component<IModalData> {
  protected closeButtonElement: HTMLButtonElement;
  protected contentElement: HTMLElement;
  protected windowElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.windowElement = ensureElement<HTMLElement>('.modal__container', this.container);

    this.closeButtonElement.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this.windowElement.addEventListener('click', (event) => event.stopPropagation());
  }

  // Сеттер protected: снаружи компонент обновляется только через render().
  protected set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren();
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}