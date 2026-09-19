import './scss/styles.scss';

import { CatalogProduct } from './components/base/Models/CatalogProduct'
import { BasketProduct } from './components/base/Models/BasketProduct'
import { BuyerProduct } from './components/base/Models/BuyerProduct'

import { apiProducts } from  './utils/data'

import { Api } from './components/base/Api'
import { WebLarekApi } from './components/base/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';

// ==========================================
// 1. Тестирование CatalogProduct
// ==========================================
console.group('--- Тестирование CatalogProduct ---');

const catalogProduct = new CatalogProduct();

// Заполнение данными
catalogProduct.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalogProduct.getItems());

// Поиск товара по ID
const foundProduct = catalogProduct.getItem(apiProducts.items[0]?.id);
console.log('Товар из каталога, найденный по ID:', foundProduct);

// Установка и получение preview
if (apiProducts.items[0]) {
  catalogProduct.setPreview(apiProducts.items[0]);
  console.log('Товар в preview:', catalogProduct.getPreview());
}

console.groupEnd();

// ==========================================
// 2. Тестирование BasketProduct
// ==========================================
console.group('--- Тестирование BasketProduct ---');

const basketProduct = new BasketProduct();

// Добавление товаров
if (apiProducts.items[1] && apiProducts.items[2]) {
  basketProduct.add(apiProducts.items[1]);
  basketProduct.add(apiProducts.items[2]);
  console.log('Товары в корзине после добавления:', basketProduct.getItems());

  // Удаление по ID
  basketProduct.remove(apiProducts.items[1].id);
  console.log('Товары в корзине после удаления по ID:', basketProduct.getItems());
}

// Очистка корзины
basketProduct.clear();
console.log('Товары в корзине после очистки:', basketProduct.getItems());

// Расчёт суммы и количества
if (apiProducts.items[0] && apiProducts.items[1] && apiProducts.items[2]) {
  basketProduct.add(apiProducts.items[0]);
  basketProduct.add(apiProducts.items[1]);
  basketProduct.add(apiProducts.items[2]);

  console.log('Общая стоимость товаров в корзине:', basketProduct.getTotalPrice());
  console.log('Общее количество товаров в корзине:', basketProduct.getCount());
}

// Проверка наличия товара в корзине
if (apiProducts.items[3]) {
  console.log('Проверка наличия товара в корзине по ID (ожидается false):', basketProduct.inBasket(apiProducts.items[3].id));
}

console.groupEnd();

// ==========================================
// 3. Тестирование BuyerProduct
// ==========================================
console.group('--- Тестирование BuyerProduct ---');

const buyerProduct = new BuyerProduct();

// 1. Начальное состояние
console.log('Начальные данные (getData):', buyerProduct.getData());
console.log('Ошибки при пустой форме (validate):', buyerProduct.validate());

// 2. Частичное заполнение (Оплата и Адрес)
buyerProduct.setData({
  payment: 'cash',
  address: 'г. Рыбинск, ул. Кольцова, д. 10',
});
console.log('Данные после частичного обновления (setData):', buyerProduct.getData());
console.log('Ошибки (должны остаться только email и phone):', buyerProduct.validate());

// 3. Полное заполнение (Email и Phone)
buyerProduct.setData({
  email: 'test@example.com',
  phone: '+79993333333',
});
console.log('Данные после полного заполнения:', buyerProduct.getData());
console.log('Ошибки при заполненной форме (ожидается пустой объект):', buyerProduct.validate());

// Проверка валидности
const isFormValid = Object.keys(buyerProduct.validate()).length === 0;
console.log('Форма валидна?:', isFormValid ? 'ДА ✅' : 'НЕТ ❌');

// 4. Очистка данных
buyerProduct.clear();
console.log('Данные после очистки (clear):', buyerProduct.getData());

console.groupEnd();


// ==========================================
// Инициализация api модели
// ==========================================
const baseApi = new Api(API_URL);
const appApi = new WebLarekApi(baseApi, CDN_URL);
const catalogModel = new CatalogProduct();

// Выполняем запрос на сервер за каталогом
appApi.getProductList()
  .then((products) => {
    // Сохраняем полученный массив товаров в модель каталога
    catalogModel.setItems(products);
    
    // Проверяем сохранённые данные в консоли
    console.group('--- Загрузка каталога с сервера ---');
    console.log('Товары из модели CatalogProduct:', catalogModel.getItems());
    console.groupEnd();
  })
  .catch((err) => {
    console.error('Ошибка при загрузке каталога с сервера:', err);
  });


