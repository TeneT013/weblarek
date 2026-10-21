import './scss/styles.scss';
import { WebLarekApi } from './components/base/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import type { TPayment } from './types';

// Модели
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

// Представления
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { CardPreview } from './components/views/CardPreview';
import { CardCatalog } from './components/views/CardCatalog';
import { CardBasket } from './components/views/CardBasket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';

// 1. Инициализация брокера событий и API
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new WebLarekApi(baseApi);

// 2. Инициализация моделей
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// 3. Инициализация представлений (View)
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery')); 
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container')); 

const basketView = new Basket(cloneTemplate<HTMLElement>('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const successView = new Success(cloneTemplate<HTMLElement>('#success'), events);
const cardPreview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), events);

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

/** Перерисовка содержимого корзины */
function renderBasket(): void {
    const items = basketModel.getItems();
    const basketItems = items.map((item, index) => {
        const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
            onDelete: () => events.emit('basket-item:action', { id: item.id })
        });
        return card.render({ title: item.title, price: item.price, index: index + 1 });
    });

    basketView.render({ 
        items: basketItems, 
        total: basketModel.getTotalPrice(), 
        buttonDisabled: items.length === 0 
    });
}

// --- РЕГИСТРАЦИЯ ОБРАБОТЧИКОВ СОБЫТИЙ ---

// 1. Управление каталогом и превью карточек
events.on('catalog:changed', () => {
    const items = catalogModel.getItems();
    const cards = items.map((item) => {
        const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'), {
            onClick: () => events.emit('card:select', { id: item.id })
        });
        return card.render({ 
            title: item.title, 
            price: item.price, 
            category: item.category, 
            image: { src: item.image, alt: item.title } 
        });
    });
    gallery.render({ catalog: cards });
});

events.on('card:select', (data: { id: string }) => {
    const item = catalogModel.getItem(data.id);
    if (item) catalogModel.setPreview(item);
});

events.on('preview:changed', () => {
    const preview = catalogModel.getPreview();
    if (!preview) {
        modal.close();
        return;
    }

    const isNoPrice = preview.price === null;
    const isInBasket = basketModel.isInBasket(preview.id);

    const buttonText = isNoPrice 
        ? 'Недоступно' 
        : (isInBasket ? 'Удалить из корзины' : 'Купить');
    
    const buttonDisabled = isNoPrice;

    modal.render({
        content: cardPreview.render({
            title: preview.title,
            price: preview.price,
            category: preview.category,
            image: { src: preview.image, alt: preview.title },
            description: preview.description,
            buttonText,
            buttonDisabled
        })
    });
});

events.on('card:action', () => {
    const preview = catalogModel.getPreview();
    if (!preview) return;

    if (basketModel.isInBasket(preview.id)) {
        basketModel.remove(preview.id);
    } else {
        basketModel.add(preview);
    }
    modal.close();
});


// 2. Управление корзиной и счетчиком в шапке
events.on('basket:changed', () => {
    header.render({ counter: basketModel.getCount() });
    renderBasket();
});

events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
});

events.on('basket-item:action', (data: { id: string }) => {
    basketModel.remove(data.id);
});


// 3. Управление оформлением заказа, формами и отправкой данных
events.on('order:open', () => {
    modal.render({
        content: orderForm.render()
    });
});

events.on('order.payment:change', (data: { value: TPayment }) => buyerModel.setData({ payment: data.value }));
events.on('order.address:change', (data: { value: string }) => buyerModel.setData({ address: data.value }));
events.on('contacts.email:change', (data: { value: string }) => buyerModel.setData({ email: data.value }));
events.on('contacts.phone:change', (data: { value: string }) => buyerModel.setData({ phone: data.value }));

events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();
    
    const orderErrors = [errors.payment, errors.address].filter(Boolean);
    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address,
        valid: orderErrors.length === 0,
        errors: orderErrors.join('; ')
    });

    const contactsErrors = [errors.email, errors.phone].filter(Boolean);
    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: contactsErrors.length === 0,
        errors: contactsErrors.join('; ')
    });
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render()
    });
});

events.on('contacts:submit', () => {
    const orderPayload = {
        ...buyerModel.getData(),
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id)
    };

    api.orderProducts(orderPayload)
        .then((result) => {
            modal.render({
                content: successView.render({ total: result.total })
            });
            basketModel.clear();
            buyerModel.clear();
        })
        .catch((err) => console.error("Ошибка при оформлении заказа:", err));
});

events.on('success:close', () => {
    modal.close();
});


// --- 4. ЗАПУСК ПРИЛОЖЕНИЯ ---

basketModel.clear();
buyerModel.clear();

api.getProductList()
    .then((data) => {
        const products = data.items.map((item) => ({
            ...item,
            image: CDN_URL + item.image,
        }));
        catalogModel.setItems(products);
    })
    .catch((err) => console.error("Ошибка при загрузке каталога:", err));