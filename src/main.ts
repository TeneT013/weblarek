import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/base/WebLarekApi';
import { EventEmitter } from './components/base/Events';

import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { ensureElement } from './utils/utils';

import { Presenter } from './components/presenter/Presenter';

// 1. Инициализация брокера событий и API
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const appApi = new WebLarekApi(baseApi);

// 2. Инициализация моделей
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// 3. Инициализация представлений (View)
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), {
    onClick: () => events.emit('basket:open')
});
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

// 4. Создание презентера с передачей готового appApi
const presenter = new Presenter(
    events,
    appApi,
    { catalog: catalogModel, basket: basketModel, buyer: buyerModel },
    { gallery, header, modal }
);

// 5. Запуск приложения (загрузка данных)
presenter.init();