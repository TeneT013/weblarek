import { IEvents } from '../base/Events';
import { CatalogModel } from '../models/CatalogModel';
import { BasketModel } from '../models/BasketModel';
import { BuyerModel } from '../models/BuyerModel';
import { Gallery } from '../views/Gallery';
import { Header } from '../views/Header';
import { Basket } from '../views/Basket';
import { Modal } from '../views/Modal';
import { CardPreview } from '../views/CardPreview';
import { CardCatalog } from '../views/CardCatalog';
import { CardBasket } from '../views/CardBasket';
import { OrderForm } from '../views/OrderForm';
import { ContactsForm } from '../views/ContactsForm';
import { Success } from '../views/Success';
import { cloneTemplate } from '../../utils/utils';
import { WebLarekApi } from '../base/WebLarekApi';
import { CDN_URL } from '../../utils/constants';

export class Presenter {
    protected events: IEvents;
    protected api: WebLarekApi;
    protected catalogModel: CatalogModel;
    protected basketModel: BasketModel;
    protected buyerModel: BuyerModel;
    
    protected gallery: Gallery;
    protected header: Header;
    protected modal: Modal;
    protected basketView: Basket;
    protected orderForm: OrderForm;
    protected contactsForm: ContactsForm;
    protected successView: Success;

    constructor(
        events: IEvents,
        api: WebLarekApi,
        models: { catalog: CatalogModel; basket: BasketModel; buyer: BuyerModel },
        views: { gallery: Gallery; header: Header; modal: Modal }
    ) {
        this.events = events;
        this.api = api;
        this.catalogModel = models.catalog;
        this.basketModel = models.basket;
        this.buyerModel = models.buyer;
        
        this.gallery = views.gallery;
        this.header = views.header;
        this.modal = views.modal;

        // Инициализация статических компонентов модальных окон
        this.basketView = new Basket(cloneTemplate<HTMLElement>('#basket'), this.events);
        this.orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), this.events);
        this.contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), this.events);
        this.successView = new Success(cloneTemplate<HTMLElement>('#success'), {
            onClick: () => this.modal.close()
        });

        this.initListeners();
    }

    /** Запуск приложения и загрузка каталога товаров с сервера */
    public init(): void {
        this.api.getProductList()
            .then((data) => {
                const products = data.items.map((item) => ({
                    ...item,
                    image: CDN_URL + item.image,
                }));
                this.catalogModel.setItems(products);
            })
            .catch((err) => console.error("Ошибка при загрузке каталога:", err));
    }

    /** Регистрация всех обработчиков событий приложения */
    protected initListeners(): void {
        this.initCatalogListeners();
        this.initBasketListeners();
        this.initOrderListeners();
    }

    /** 1. Управление каталогом и превью карточек */
    protected initCatalogListeners(): void {
        // Рендер каталога при изменении данных в модели
        this.events.on('catalog:changed', (data: { items: any[] }) => {
            const cards = data.items.map((item) => {
                const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'), {
                    onClick: () => this.events.emit('card:select', { id: item.id })
                });
                return card.render({ title: item.title, price: item.price, category: item.category, image: item.image });
            });
            this.gallery.render({ catalog: cards });
        });

        // Выбор карточки в каталоге -> запрос товара для превью
        this.events.on('card:select', (data: { id: string }) => {
            const item = this.catalogModel.getItem(data.id);
            if (item) this.catalogModel.setPreview(item);
        });

        // Отрисовка модального окна превью товара
        this.events.on('preview:changed', (data: { preview: any }) => {
            if (!data.preview) {
                this.modal.close();
                return;
            }

            const cardPreview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), {
                onClick: () => this.events.emit('basket:add', data.preview)
            });

            cardPreview.setButtonText(this.basketModel.isInBasket(data.preview.id) ? 'Удалить из корзины' : 'Купить');

            if (data.preview.price === null) {
                cardPreview.setButtonText('Недоступно');
                cardPreview.setButtonDisabled(true);
            } else {
                const isInBasket = this.basketModel.isInBasket(data.preview.id);
                cardPreview.setButtonText(isInBasket ? 'Удалить из корзины' : 'Купить');
                cardPreview.setButtonDisabled(false);
            }

            this.modal.render({
                content: cardPreview.render({
                    title: data.preview.title,
                    price: data.preview.price,
                    category: data.preview.category,
                    image: data.preview.image,
                    description: data.preview.description,
                })
            });
            this.modal.open();
        });
    }

    /** 2. Управление корзиной и счетчиком в шапке */
    protected initBasketListeners(): void {
        // Обновление счетчика товаров в шапке
        this.events.on('basket:changed', () => {
            this.header.counter = this.basketModel.getCount();
        });

        // Открытие модального окна корзины
        this.events.on('basket:open', () => {
            this.renderBasket();
            this.modal.render({ content: this.basketView.render() });
            this.modal.open();
        });

        // Добавление / удаление товара из корзины через превью
        this.events.on('basket:add', (item: any) => {
            if (this.basketModel.isInBasket(item.id)) {
                this.basketModel.remove(item.id);
            } else {
                this.basketModel.add(item);
            }
            this.modal.close();
        });

        // Удаление товара непосредственно из списка корзины
        this.events.on('basket:remove', (data: { id: string }) => {
            this.basketModel.remove(data.id);
            this.renderBasket();
        });
    }

    /** Вспомогательный метод для перерисовки содержимого корзины */
    protected renderBasket(): void {
        const basketItems = this.basketModel.getItems().map((item, index) => {
            const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
                onDelete: () => this.events.emit('basket:remove', { id: item.id })
            });
            return card.render({ title: item.title, price: item.price, index: index + 1 });
        });

        this.basketView.render({ items: basketItems, total: this.basketModel.getTotalPrice() });
    }

    /** 3. Управление оформлением заказа, формами и отправкой данных */
    protected initOrderListeners(): void {
        // Открытие первой формы заказа (адрес и оплата) из корзины
        this.events.on('order:open', () => {
            const data = this.buyerModel.getData();
            this.modal.render({
                content: this.orderForm.render({ payment: data.payment, address: data.address, valid: false, errors: [] })
            });
            this.modal.open();
        });

        // Сохранение изменений полей ввода в модель покупателя
        this.events.on('order.payment:change', (data: { value: string }) => this.buyerModel.setData({ payment: data.value as any }));
        this.events.on('order.address:change', (data: { value: string }) => this.buyerModel.setData({ address: data.value }));
        this.events.on('contacts.email:change', (data: { value: string }) => this.buyerModel.setData({ email: data.value }));
        this.events.on('contacts.phone:change', (data: { value: string }) => this.buyerModel.setData({ phone: data.value }));

        // Валидация и обновление состояния форм при изменении данных покупателя
        this.events.on('buyer:changed', () => {
            const errors = this.buyerModel.validate();
            
            // Проверка ошибок для формы адреса/оплаты
            const orderErrors = [errors.payment, errors.address].filter(Boolean);
            this.orderForm.render({
                valid: orderErrors.length === 0,
                errors: orderErrors.join('; ')
            });

            // Проверка ошибок для формы контактов
            const contactsErrors = [errors.email, errors.phone].filter(Boolean);
            this.contactsForm.render({
                valid: contactsErrors.length === 0,
                errors: contactsErrors.join('; ')
            });
        });

        // Сабмит первой формы -> переход к форме контактов
        this.events.on('order:submit', () => {
            const data = this.buyerModel.getData();
            this.modal.render({
                content: this.contactsForm.render({ email: data.email, phone: data.phone, valid: false, errors: [] })
            });
        });

        // Сабмит второй формы -> отправка итогового заказа на сервер
        this.events.on('contacts:submit', () => {
            const orderPayload = {
                ...this.buyerModel.getData(),
                total: this.basketModel.getTotalPrice(),
                items: this.basketModel.getItems().map(item => item.id)
            };

            this.api.orderProducts(orderPayload)
                .then((result) => {
                    // Успешный заказ: показываем экран успеха, очищаем корзину и данные
                    this.modal.render({
                        content: this.successView.render({ total: result.total })
                    });
                    this.basketModel.clear();
                    this.buyerModel.clear();
                })
                .catch((err) => console.error("Ошибка при оформлении заказа:", err));
        });
    }
}