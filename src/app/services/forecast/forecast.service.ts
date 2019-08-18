import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Subject } from 'rxjs';
import { ForecastContainer, Forecast } from 'src/app/models/ForecastContainer';
import { GeolocationService } from '../geolocation/geolocation.service';
import { first } from 'rxjs/operators';
import { TempUnit } from 'src/app/models/WeatherContainer';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  private readonly weatherSubject: Subject<ForecastContainer>;
  private readonly errorSubject: Subject<any>;

  private forecastContainer: ForecastContainer;

  constructor(
    private httpService: HttpService,
    private geolocationService: GeolocationService
  ) {
    this.weatherSubject = new Subject<ForecastContainer>();
    this.errorSubject = new Subject<any>();
  }

  onForecast$() {
    return this.weatherSubject.asObservable();
  }

  onError$() {
    return this.errorSubject.asObservable();
  }

  requestForecastByID(id: number) {
    this.httpService.getForecastById(id)
    .subscribe(this.emitForecast.bind(this), this.emitError.bind(this));
  }

  requestForecastByBeoCoords() {
    this.geolocationService.onGeolocation$().pipe(first())
    .subscribe(coords => {
      this.httpService.getForecastByGeoCoord(coords)
      .subscribe(this.emitForecast.bind(this), this.emitError.bind(this));
    });
    this.geolocationService.requestCurrentPosition();
  }

  setTempUnit(unit: TempUnit) {
    this.forecastContainer = this.forecastContainer.setUnit(unit);
    this.weatherSubject.next(this.forecastContainer);
  }

  private emitForecast(forecast: Forecast) {
    this.forecastContainer = ForecastContainer.from(forecast);
    this.weatherSubject.next(this.forecastContainer);
  }

  private emitError(error: any) {
    this.errorSubject.next(error);
  }
}
