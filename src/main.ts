import "./scss/styles.scss";

import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { apiProducts } from "./utils/data";

import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/base/WebLarekApi";
import { API_URL, CDN_URL } from "./utils/constants";

// ==========================================
// 1. Тестирование CatalogModel
// ==========================================
console.group("--- Тестирование CatalogModel ---");

const catalogModel = new CatalogModel();

// Заполнение данными
catalogModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", catalogModel.getItems());

// Поиск товара по ID
const foundProduct = catalogModel.getItem(apiProducts.items[0]?.id);
console.log("Товар из каталога, найденный по ID:", foundProduct);

// Установка и получение preview
if (apiProducts.items[0]) {
  catalogModel.setPreview(apiProducts.items[0]);
  console.log("Товар в preview:", catalogModel.getPreview());
}

console.groupEnd();

// ==========================================
// 2. Тестирование BasketModel
// ==========================================
console.group("--- Тестирование BasketModel ---");

const basketModel = new BasketModel();

// Добавление товаров
if (apiProducts.items[1] && apiProducts.items[2]) {
  basketModel.add(apiProducts.items[1]);
  basketModel.add(apiProducts.items[2]);
  console.log("Товары в корзине после добавления:", basketModel.getItems());

  // Удаление по ID
  basketModel.remove(apiProducts.items[1].id);
  console.log(
    "Товары в корзине после удаления по ID:",
    basketModel.getItems(),
  );
}

// Очистка корзины
basketModel.clear();
console.log("Товары в корзине после очистки:", basketModel.getItems());

// Расчёт суммы и количества
if (apiProducts.items[0] && apiProducts.items[1] && apiProducts.items[2]) {
  basketModel.add(apiProducts.items[0]);
  basketModel.add(apiProducts.items[1]);
  basketModel.add(apiProducts.items[2]);

  console.log(
    "Общая стоимость товаров в корзине:",
    basketModel.getTotalPrice(),
  );
  console.log("Общее количество товаров в корзине:", basketModel.getCount());
}

// Проверка наличия товара в корзине
if (apiProducts.items[3]) {
  console.log(
    "Проверка наличия товара в корзине по ID (ожидается false):",
    basketModel.isInBasket(apiProducts.items[3].id),
  );
}

console.groupEnd();

// ==========================================
// 3. Тестирование BuyerModel
// ==========================================
console.group("--- Тестирование BuyerModel ---");

const buyerModel = new BuyerModel();

// 1. Начальное состояние
console.log("Начальные данные (getData):", buyerModel.getData());
console.log("Ошибки при пустой форме (validate):", buyerModel.validate());

// 2. Частичное заполнение (Оплата и Адрес)
buyerModel.setData({
  payment: "cash",
  address: "г. Рыбинск, ул. Кольцова, д. 10",
});
console.log(
  "Данные после частичного обновления (setData):",
  buyerModel.getData(),
);
console.log(
  "Ошибки (должны остаться только email и phone):",
  buyerModel.validate(),
);

// 3. Полное заполнение (Email и Phone)
buyerModel.setData({
  email: "test@example.com",
  phone: "+79993333333",
});
console.log("Данные после полного заполнения:", buyerModel.getData());
console.log(
  "Ошибки при заполненной форме (ожидается пустой объект):",
  buyerModel.validate(),
);

// Проверка валидности
const isFormValid = Object.keys(buyerModel.validate()).length === 0;
console.log("Форма валидна?:", isFormValid ? "ДА ✅" : "НЕТ ❌");

// 4. Очистка данных
buyerModel.clear();
console.log("Данные после очистки (clear):", buyerModel.getData());

console.groupEnd();

// ==========================================
// Инициализация api модели
// ==========================================
const baseApi = new Api(API_URL);
const appApi = new WebLarekApi(baseApi);

// Выполняем запрос на сервер за каталогом
appApi
  .getProductList()
  .then((data) => {
    // Сохраняем полученный массив товаров в модель каталога
    const products = data.items.map((item) => ({
      ...item,
      image: CDN_URL + item.image
    }));
    catalogModel.setItems(products)
    // Проверяем сохранённые данные в консоли
    console.group("--- Загрузка каталога с сервера ---");
    console.log("Товары из модели CatalogModel:", catalogModel.getItems());
    console.groupEnd();
  })
  .catch((err) => {
    console.error("Ошибка при загрузке каталога с сервера:", err);
  });
