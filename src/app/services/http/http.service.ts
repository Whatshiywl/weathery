import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Weather } from '../weather/WeatherContainer';

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

  getWeatherByGeoCoord(coords: Coordinates) {
    let params = new HttpParams();
    params = params.set('lat', coords.latitude.toString());
    params = params.set('lon', coords.longitude.toString());
    return this.get<Weather>(this.getWeatherUrl, params);
  }

  private get<T>(url: string, params: HttpParams) {
    return this.http.get<T>(url, { params }).pipe(first(), catchError(this.handleError));
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
