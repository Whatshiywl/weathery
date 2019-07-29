import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private location: string;

  private getWeatherUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.location = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    this.getWeatherUrl = this.mountUrl('data/2.5/weather?q=London');
  }

  getWeather() {
    return this.http.get(this.getWeatherUrl).pipe(catchError(this.handleError));
  }

  private handleError<T>(error: any, caught: Observable<T>) {
    console.error(error);
    return throwError(error);
  }

  private mountUrl(endpoint: string) {
    return `${this.location}/${endpoint}`;
  }

}
