import { Component, OnInit } from '@angular/core';
import { WeatherContainer } from 'src/app/services/weather/WeatherContainer';
import { WeatherService } from 'src/app/services/weather/weather.service';

@Component({
  selector: 'weathery-daily-weather',
  templateUrl: './daily-weather.component.html',
  styleUrls: ['./daily-weather.component.scss']
})
export class DailyWeatherComponent implements OnInit {
  container: WeatherContainer;
  tempClass: string;

  precArray: number[];
  private precIcons = 5;
  private maxPrec = 10;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
    this.precArray = [];
    for (let rain = 0; rain < this.precIcons; rain++) {
      this.precArray.push(this.maxPrec * rain / this.precIcons);
    }

    this.weatherService.onWeather$()
    .subscribe(container => {
      this.container = container;
      this.tempClass = container.getTempClassLight();
    });
  }

  getWeather() {
    return this.container.getWeather();
  }

  getIcon() {
    return this.container.getIcon();
  }

  getUnit() {
    return this.container.getUnit();
  }

  getPrecClass(prec: number) {
    const weather = this.container.getWeather();
    const isRaining = weather && weather.rain;
    const isSnowing = weather && weather.snow;
    const currentPrec = isSnowing ? weather.snow["3h"] : (isRaining ? weather.rain["3h"] : 0);
    return {
      "wi-raindrop": !isSnowing,
      "wi-snowflake-cold": isSnowing,
      empty: prec >= currentPrec
    };
  }

}
