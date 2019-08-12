import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  private readonly coordinatesSubject: Subject<Coordinates>;
  private readonly errorSubject: Subject<any>;

  constructor( ) {
    this.coordinatesSubject = new Subject<Coordinates>();
    this.errorSubject = new Subject<any>();
  }

  onGeolocation$() {
    return this.coordinatesSubject.asObservable();
  }

  onError$() {
    return this.errorSubject.asObservable();
  }

  requestCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.emitPosition.bind(this), 
        this.emitError.bind(this), {
        enableHighAccuracy: true
      });
    } else {
      this.emitError({
        code: 2,
      });
    }
  }

  private emitPosition(position: Position) {
    this.coordinatesSubject.next(position.coords);
  }

  private emitError(error: any) {
    this.errorSubject.next(error);
  }
}
