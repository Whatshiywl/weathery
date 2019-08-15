import { Injectable } from '@angular/core';
import { TempUnit } from 'src/app/models/WeatherContainer';

interface Storage {
  unit: TempUnit;
  str: string;
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
    localStorage.setItem(key, value);
  }

  get<T extends keyof Storage>(key: T) {
    return this.retreive(key) as Storage[T];
  }

  getString(key: StringStorage) {
    return this.retreive(key) as Storage[StringStorage];
  }

  getNumber(key: NumberStorage) {
    return Number(this.retreive(key));
  }

  getBoolean(key: BooleanStorage) {
    return this.retreive(key) === 'true';
  }

  getObject<T = any>(key: ObjectStorage) {
    const storedValue = this.retreive(key);
    try {
      return JSON.parse(storedValue) as T;
    } catch (error) {
      console.error('Could not parse', storedValue);
      console.error(error);
    }
  }

  private retreive(key: string) {
    return localStorage.getItem(key);
  }
}
