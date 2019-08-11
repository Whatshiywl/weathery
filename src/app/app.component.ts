import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Weathery';
  tempClass: string;
  
  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(container => {
      this.tempClass = container.getTempClass();
    });
  }

}
