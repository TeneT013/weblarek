import { TPayment, IBuyer, TBuyerErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private payment: TPayment | "";
  private address: string;
  private phone: string;
  private email: string;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  /**
   * Сохраняет переданные данные покупателя.
   * Принимает частичные данные (Partial<IBuyer>), позволяя обновлять
   * отдельные поля, не затрагивая остальные.
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;
    this.events.emit('buyer:changed')
  }

  /** Возвращает полный объект с текущими данными покупателя */
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  /** Сбрасывает все поля покупателя к исходным пустым значениям */
  clear(): void {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events.emit('buyer:changed');
  }

  /**
   * Проверяет заполненность полей.
   * Возвращает объект, где ключи — имена полей с ошибкой,
   * а значения — текст ошибки. Если ошибок нет, возвращает пустой объект.
   */
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this.address.trim()) {
      errors.address = "Необходимо указать адрес доставки";
    }
    if (!this.email.trim()) {
      errors.email = "Укажите email";
    }
    if (!this.phone.trim()) {
      errors.phone = "Укажите номер телефона";
    }

    return errors;
  }
}
