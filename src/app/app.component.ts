import { Component, OnInit } from '@angular/core';
import { HttpService, Weather } from './services/http/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Weathery';
  
  currentWeather: Weather;
  tempUnit: 'C' | 'F';

  geolocationError: string;
  comfortIndex: number;

  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        const coords = position.coords;
        this.httpService.getWeatherByGeoCoord(coords.latitude, coords.longitude).subscribe(weather => {
          this.geolocationError = undefined;
          this.currentWeather = weather;
          this.comfortIndex = this.getTempScale(weather.main.temp);
        }, () => alert('Error getting weather'));
      }, err => {
        this.currentWeather = undefined;
        switch (err.code) {
          case 1:
            this.geolocationError = 'Location denied';
            break;
          case 2:
            this.geolocationError = 'Location unavailable';
            break;
          case 3:
            this.geolocationError = 'Location timed out';
            break;
        }
      }, {
        enableHighAccuracy: true
      });
    } else {
      alert('Geolocation not supported!');
    }
  }
  
  onTempUnitToggle(switchEvent: 'C' | 'F') {
    this.tempUnit = switchEvent;
  }

  getTempScale(temp) {
    const mid = 273 + 20;
    const T = temp - mid;
    const p1 = 20;
    const p2 = 20;
    return Math.round(100 / (Math.exp(-(T / p1 + Math.exp(T / p2) - 1)) + 1));
  }

}
