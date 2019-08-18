import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WeatherContainer } from 'src/app/models/WeatherContainer';

@Component({
  selector: 'weathery-daily-weather',
  templateUrl: './daily-weather.component.html',
  styleUrls: ['./daily-weather.component.scss']
})
export class DailyWeatherComponent implements OnInit, OnChanges {
  @Input() container: WeatherContainer;
  @Input() small: boolean;
  tempClass: string;

  precArray: number[];
  private precIcons = 5;
  private maxPrec = 5;

  constructor( ) {
    this.tempClass = 'temp-color-50-light';
  }

  ngOnInit() {
    this.precArray = [];
    for (let rain = 0; rain < this.precIcons; rain++) {
      this.precArray.push(this.maxPrec * rain / this.precIcons);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.container && changes.container.currentValue) {
      this.container = changes.container.currentValue as WeatherContainer;
      this.tempClass = this.container.getTempClassLight();
    }
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

  isPrecipitating() {
    const weather = this.container.getWeather();
    const isRaining = weather && weather.rain;
    const isSnowing = weather && weather.snow;
    const currentPrec = isSnowing ? 
    (weather.snow['3h'] || weather.snow['1h']*3) : 
    (isRaining ? 
      (weather.rain['3h'] || weather.rain['1h']*3) : 
      0);
    return currentPrec > 0;
  }

  getPrecClass(prec: number) {
    const weather = this.container.getWeather();
    const isRaining = weather && weather.rain;
    const isSnowing = weather && weather.snow;
    const currentPrec = isSnowing ? 
    (weather.snow['3h'] || weather.snow['1h']*3) : 
    (isRaining ? 
      (weather.rain['3h'] || weather.rain['1h']*3) : 
      0);
    return {
      'wi-raindrop': !isSnowing,
      'wi-snowflake-cold': isSnowing,
      empty: prec >= currentPrec
    };
  }

}
