import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class CatalogModel {
  private _items: IProduct[];
  private _preview: IProduct | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events
    this._items = [];
    this._preview = null;
  }

  /** Сохраняет полученный массив товаров в модель */
  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('catalog:changed', { items: this._items });
  }

  /** Возвращает текущий массив товаров из модели */
  getItems(): IProduct[] {
    return this._items;
  }

  /** Находит и возвращает один товар по его уникальному id */
  getItem(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  /** Сохраняет товар для детального отображения в модальном окне */
  setPreview(item: IProduct): void {
    this._preview = item;
    this.events.emit('preview:changed', { preview: this._preview });
  }

  /** Возвращает товар, выбранный для подробного отображения */
  getPreview(): IProduct | null {
    return this._preview;
  }
}
