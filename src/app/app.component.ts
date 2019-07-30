import { Component, OnInit } from '@angular/core';
import { HttpService, Weather } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'weathery';
  weather: Weather;
  weatherIcon: {
    src: string;
    alt: string;
  };

  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        const coords = position.coords;
        this.httpService.getWeatherByGeoCoord(coords.latitude, coords.longitude).subscribe(weather => {
          console.log(weather);
          this.weather = weather;
          if (weather.weather.length) {
            this.weatherIcon = {
              src: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
              alt: weather.weather[0].description
            };
          }
        }, () => alert('Error getting weather'));
      });
    } else {
      alert('Geolocation not supported!');
    }
  }

}
