import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';

@Component({
  selector: 'weathery-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  locationError: string;
  location: string;
  loadingMsg: string;
  tempClass: string;

  constructor(
    private weatherService: WeatherService
  ) {
    this.loadingMsg = 'Loading...';
  }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(container => {
      this.location = container.getLocation();
      this.tempClass = container.getTempClass();
    }, err => {
      switch (err.code) {
      case 1:
        this.locationError = 'Location denied';
        break;
      case 2:
        this.locationError = 'Location unavailable';
        break;
      case 3:
        this.locationError = 'Location timed out';
        break;
      }
    });
  }

}
