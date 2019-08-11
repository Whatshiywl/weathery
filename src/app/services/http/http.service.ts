import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Weather } from '../weather/WeatherContainer';

export interface City {
  id: number;
  name: string;
  country: string;
  coords: {
    lon: number;
    lat: number;
  };
}

export interface SearchResults {
  size: number;
  results: {
    city: City;
    score: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private location: string;

  private getWeatherUrl: string;
  private getFindLocationUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.location = `${window.location.protocol}//${window.location.hostname}:${environment.production ? window.location.port : '9400'}`;
    this.getWeatherUrl = this.mountApiUrl('weather');
    this.getFindLocationUrl = this.mountUrl('find');
  }

  getWeatherByName(name: string) {
    let params = new HttpParams();
    params = params.set('q', name);
    return this.get<Weather>(this.getWeatherUrl, params);
  }

  getWeatherByID(id: number) {
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

  getLocationsByName(name?: string, country?: string, top?: number) {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (country) params = params.set('country', country);
    if (top) params = params.set('top', top.toString());
    return this.get<SearchResults>(this.getFindLocationUrl, params);
  }

  private get<T>(url: string, params?: HttpParams) {
    return this.http.get<T>(url, { params }).pipe(first(), catchError(this.handleError));
  }

  private handleError<T>(error: any, caught: Observable<T>) {
    console.error(error);
    return throwError(error);
  }

  private mountApiUrl(endpoint: string) {
    if (endpoint.startsWith('/')) {
      endpoint = endpoint.substr(1);
    }
    return this.mountUrl(`api/${endpoint}`);
  }

  private mountUrl(endpoint: string) {
    if (endpoint.startsWith('/')) {
      endpoint = endpoint.substr(1);
    }
    return `${this.location}/${endpoint}`;
  }

}
