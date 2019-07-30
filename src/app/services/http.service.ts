import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
export interface Weather {
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lat: number;
    lon: number;
  };
  dt: number;
  id: number;
  main: {
    humidity: number;
    pressure: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  sys: {
    country: string;
    id: number;
    message: number;
    sunrise: number;
    sunset: number;
    type: number;
  };
  timezone: number;
  visibility: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    deg: number;
    speed: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private location: string;

  private getWeatherUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.location = `${window.location.protocol}//${window.location.hostname}:${environment.production ? window.location.port : '9400'}`;
    this.getWeatherUrl = this.mountUrl('weather');
  }

  getWeatherByCityName(name: string) {
    let params = new HttpParams();
    params = params.set('q', name);
    return this.get<Weather>(this.getWeatherUrl, params);
  }

  getWeatherByCityID(id: number) {
    let params = new HttpParams();
    params = params.set('id', id.toString());
    return this.get<Weather>(this.getWeatherUrl, params);
  }

  getWeatherByGeoCoord(lat: number, lon: number) {
    let params = new HttpParams();
    params = params.set('lat', lat.toString());
    params = params.set('lon', lon.toString());
    return this.get<Weather>(this.getWeatherUrl, params);
  }

  private get<T>(url: string, params: HttpParams) {
    return this.http.get<T>(url, { params }).pipe(catchError(this.handleError));
  }

  private handleError<T>(error: any, caught: Observable<T>) {
    console.error(error);
    return throwError(error);
  }

  private mountUrl(endpoint: string) {
    if (endpoint.startsWith('/')) {
      endpoint = endpoint.substr(1);
    }
    return `${this.location}/api/${endpoint}`;
  }

}
