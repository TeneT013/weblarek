import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class CatalogModel {
  private items: IProduct[];
  private preview: IProduct | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events
    this.items = [];
    this.preview = null;
  }

  /** Сохраняет полученный массив товаров в модель */
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed');
  }

  /** Возвращает текущий массив товаров из модели */
  getItems(): IProduct[] {
    return this.items;
  }

  /** Находит и возвращает один товар по его уникальному id */
  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  /** Сохраняет товар для детального отображения в модальном окне */
  setPreview(item: IProduct): void {
    this.preview = item;
    this.events.emit('preview:changed');
  }

  /** Возвращает товар, выбранный для подробного отображения */
  getPreview(): IProduct | null {
    return this.preview;
  }
}
