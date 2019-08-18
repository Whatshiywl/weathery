import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather/weather.service';
import { ForecastService } from './services/forecast/forecast.service';
import { WeatherContainer } from './models/WeatherContainer';
import { ForecastContainer } from './models/ForecastContainer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Weathery';
  tempClass: string;

  currentWeather: WeatherContainer;
  forecastWeathers: WeatherContainer[];

  constructor(
    private weatherService: WeatherService,
    private forecastService: ForecastService
  ) { }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(container => {
      this.currentWeather = container;
      this.tempClass = container.getTempClass();
    });

    this.forecastService.onForecast$()
    .subscribe(forecastContainer => {
      this.forecastWeathers = forecastContainer.getNextDays();
    });
  }

}
