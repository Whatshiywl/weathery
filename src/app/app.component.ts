import { Component, OnInit } from '@angular/core';
import { HttpService, Weather } from './services/http.service';

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

}
