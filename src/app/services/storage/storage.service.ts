import { Injectable } from '@angular/core';
import { TempUnit } from 'src/app/models/WeatherContainer';

interface Storage {
  unit: TempUnit;
}

type FilterStorage<Condition> = {
  [Key in keyof Storage]:
    Storage[Key] extends Condition ? Key : never;
}[keyof Storage];

type StringStorage = FilterStorage<string>;
type NumberStorage = FilterStorage<number>;
type BooleanStorage = FilterStorage<boolean>;
type ObjectStorage = FilterStorage<object>;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storage: any = {};

  constructor() { }

  set<T extends keyof Storage>(key: T, value: Storage[T]) {
    const valueType = typeof value;
    let storeValue: string;
    switch (valueType) {
      case 'string':
      case 'number':
      case 'bigint':
      case 'boolean':
      case 'undefined':
        storeValue = String(value);
        break;
      case 'object':
        storeValue = JSON.stringify(value);
        break;
      default:
        throw new TypeError(`Unsuported type ${valueType} for value`);
    }
    this.storage[key] = storeValue;
  }

  getAny<T extends keyof Storage>(key: T) {
    return this.get(key);
  }

  getString(key: StringStorage) {
    return this.get(key);
  }

  getNumber(key: NumberStorage) {
    return Number(this.get(key));
  }

  getBoolean(key: BooleanStorage) {
    return this.get(key) === 'true';
  }

  getObject<T = any>(key: ObjectStorage) {
    const storedValue = this.get(key);
    try {
      return JSON.parse(storedValue) as T;
    } catch (error) {
      console.error('Could not parse', storedValue);
      console.error(error);
    }
  }

  private get(key: string) {
    return localStorage.getItem(key);
  }
}
