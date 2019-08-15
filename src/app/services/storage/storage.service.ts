import { Injectable } from '@angular/core';
import { Weather } from 'src/app/models/WeatherContainer';

interface Storage {
  weather: Weather
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
        storeValue = value ? JSON.stringify(value) : undefined;
        break;
      default:
        throw new TypeError(`Unsuported type ${valueType} for value`);
    }
    localStorage.setItem(key, storeValue);
  }

  get<T extends keyof Storage>(key: T) {
    return this.retreive(key);
  }

  getString(key: StringStorage) {
    return this.retreive(key) as Storage[StringStorage];
  }

  getNumber(key: NumberStorage) {
    return Number(this.retreive(key)) as Storage[NumberStorage];
  }

  getBoolean(key: BooleanStorage) {
    return this.retreive(key) === 'true' as Storage[BooleanStorage];
  }

  getObject(key: ObjectStorage) {
    const storedValue = this.retreive(key);
    if (!storedValue || ['undefined', 'null'].includes(storedValue)) return undefined;
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error('Could not parse', storedValue);
      console.error(error);
    }
  }

  private retreive(key: string) {
    return localStorage.getItem(key);
  }
}
