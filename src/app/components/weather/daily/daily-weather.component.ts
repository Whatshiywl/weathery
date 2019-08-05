import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Weather } from 'src/app/services/http/http.service';

@Component({
  selector: 'weathery-daily-weather',
  templateUrl: './daily-weather.component.html',
  styleUrls: ['./daily-weather.component.scss']
})
export class DailyWeatherComponent implements OnInit, OnChanges {
  @Input() weather: Weather;
  @Input() tempUnit: 'C' | 'F';
  
  weatherIcon: {
    src: string;
    alt: string;
  };
  precIcons = 5;
  maxPrec = 10;
  precArray: number[];

  constructor( ) { }

  ngOnInit() {
    this.precArray = [];
    for (let rain = 0; rain < this.precIcons; rain++) {
      this.precArray.push(this.maxPrec * rain / this.precIcons);
    }
  }

  ngOnChanges(evt: SimpleChanges) {
    console.log(evt);
    if (evt.weather) {
      if (this.weather && this.weather.weather.length) {
        this.weatherIcon = {
          src: `http://openweathermap.org/img/wn/${this.weather.weather[0].icon}@2x.png`,
          alt: this.weather.weather[0].main
        };
      }
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
