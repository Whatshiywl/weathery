import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
    return this.get(this.getWeatherUrl, params);
  }

  getWeatherByCityID(id: number) {
    let params = new HttpParams();
    params = params.set('id', id.toString());
    return this.get(this.getWeatherUrl, params);
  }

  getWeatherByGeoCoord(lat: number, lon: number) {
    let params = new HttpParams();
    params = params.set('lat', lat.toString());
    params = params.set('lon', lon.toString());
    return this.get(this.getWeatherUrl, params);
  }

  private get(url: string, params: HttpParams) {
    return this.http.get(url, { params }).pipe(catchError(this.handleError));
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
