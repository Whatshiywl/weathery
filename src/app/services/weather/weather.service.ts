import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Subject } from 'rxjs';
import { WeatherContainer, Weather, TempUnit } from '../../models/WeatherContainer';
import { GeolocationService } from '../geolocation/geolocation.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly weatherSubject: Subject<WeatherContainer>;
  private readonly errorSubject: Subject<any>;

  private weatherContainer: WeatherContainer;

  constructor(
    private httpService: HttpService,
    private geolocationService: GeolocationService
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
    this.httpService.getWeatherByID(id)
    .subscribe(this.emitWeather.bind(this), this.emitError.bind(this));
  }

  requestWeatherByBeoCoords() {
    this.geolocationService.onGeolocation$().pipe(first())
    .subscribe(coords => {
      this.httpService.getWeatherByGeoCoord(coords)
      .subscribe(this.emitWeather.bind(this), this.emitError.bind(this));
    });
    this.geolocationService.requestCurrentPosition();
  }

  setWeather(weather: Weather) {
    this.emitWeather(weather);
  }

  setTempUnit(unit: TempUnit) {
    this.weatherContainer = this.weatherContainer.setUnit(unit);
    this.emitWeather(this.weatherContainer.getWeather());
  }

  private emitWeather(weather: Weather) {
    this.weatherContainer = this.weatherContainer.setWeather(weather);
    this.weatherSubject.next(this.weatherContainer);
  }

  private emitError(error: any) {
    this.errorSubject.next(error);
  }

}
