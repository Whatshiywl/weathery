import { Component, OnInit, Input } from '@angular/core';
import { HttpService, Weather } from 'src/app/services/http.service';

@Component({
  selector: 'weathery-daily-weather',
  templateUrl: './daily-weather.component.html',
  styleUrls: ['./daily-weather.component.scss']
})
export class DailyWeatherComponent implements OnInit {
  @Input() tempUnit: 'C' | 'F';
  
  weather: Weather;
  weatherIcon: {
    src: string;
    alt: string;
  };
  precIcons = 5;
  maxPrec = 10;
  precArray: number[];

  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.precArray = [];
    for (let rain = 0; rain < this.precIcons; rain++) {
      this.precArray.push(this.maxPrec * rain / this.precIcons);
    }
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
              alt: weather.weather[0].main
            };
          }
        }, () => alert('Error getting weather'));
      });
    } else {
      alert('Geolocation not supported!');
    }
  }

  getPrecClass(prec: number) {
    const isRaining = this.weather && this.weather.rain;
    const isSnowing = this.weather && this.weather.snow;
    const currentPrec = isSnowing ? this.weather.snow["3h"] : (isRaining ? this.weather.rain["3h"] : 0);
    return {
      "wi-raindrop": !isSnowing,
      "wi-snowflake-cold": isSnowing,
      empty: prec >= currentPrec
    };
  }

}
