import {TPayment, IBuyer} from '../../../types/index'

export class BuyerProduct {
  private _payment: TPayment;
  private _address: string;
  private _phone: string;
  private _email: string;

  constructor() {
    this._payment = '';
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  /**
   * Сохраняет переданные данные покупателя.
   * Принимает частичные данные (Partial<IBuyer>), позволяя обновлять
   * отдельные поля, не затрагивая остальные.
   */
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.email !== undefined) this._email = data.email;
  }

  /** Возвращает полный объект с текущими данными покупателя */
  getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  /** Сбрасывает все поля покупателя к исходным пустым значениям */
  clear(): void {
    this._payment = '';
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  /**
   * Проверяет заполненность полей.
   * Возвращает объект, где ключи — имена полей с ошибкой,
   * а значения — текст ошибки. Если ошибок нет, возвращает пустой объект.
   */
  validate(): Record<keyof IBuyer, string> {
    const errors = {} as Record<keyof IBuyer, string>;

    if (!this._payment) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (!this._address.trim()) {
      errors.address = 'Необходимо указать адрес доставки';
    }
    if (!this._email.trim()) {
      errors.email = 'Укажите email';
    }
    if (!this._phone.trim()) {
      errors.phone = 'Укажите номер телефона';
    }

    return errors;
  }
}