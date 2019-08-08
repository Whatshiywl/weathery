import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Subject } from 'rxjs';
import { WeatherContainer, Weather, TempUnit } from './WeatherContainer';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly weatherSubject: Subject<WeatherContainer>;
  private readonly errorSubject: Subject<any>;

  private weatherContainer: WeatherContainer;

  constructor(
    private httpService: HttpService
  ) {
    this.weatherSubject = new Subject<WeatherContainer>();
    this.errorSubject = new Subject<any>();

    this.weatherContainer = new WeatherContainer();
  }

  onWeather$() {
    return this.weatherSubject.asObservable();
  }

  onError$() {
    return this.errorSubject.asObservable();
  }

  requestWeatherByID(id: number) {
    this.httpService.getWeatherByCityID(id)
    .subscribe(this.emitWeather.bind(this), this.emitError.bind(this));
  }

  requestWeatherByName(name: string) {
    this.httpService.getWeatherByCityName(name)
    .subscribe(this.emitWeather.bind(this), this.emitError.bind(this));
  }

  requestWeatherByBeoCoords() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.httpService.getWeatherByGeoCoord(position.coords)
        .subscribe(this.emitWeather.bind(this), this.emitError.bind(this));
      }, this.emitError.bind(this), {
        enableHighAccuracy: true
      });
    } else {
      this.emitError({
        code: 2,
      });
    }
  }

  setTempUnit(unit: TempUnit) {
    this.weatherContainer = this.weatherContainer.setUnit(unit);
    this.emitWeather(this.weatherContainer.getWeather());
  }

  getContainer() {
    return this.weatherContainer;
  }

  private emitWeather(weather: Weather) {
    this.weatherContainer = this.weatherContainer.setWeather(weather);
    this.weatherSubject.next(this.weatherContainer);
  }

  private emitError(error: any) {
    this.errorSubject.next(error);
  }

}
