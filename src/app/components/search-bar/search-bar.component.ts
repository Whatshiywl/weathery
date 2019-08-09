import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';

@Component({
  selector: 'weathery-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  location: string;
  tempClass: string;

  constructor(
    private weatherService: WeatherService
  ) {
    this.location = 'Loading...';
  }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(container => {
      this.location = container.getLocation();
      this.tempClass = container.getTempClass();
    });

    this.weatherService.onError$().subscribe(err => {
      switch (err.code) {
      case 1:
        this.location = 'Location denied';
        break;
      case 2:
        this.location = 'Location unavailable';
        break;
      case 3:
        this.location = 'Location timed out';
        break;
      }
    });
  }

  onGeolocation(evt: MouseEvent) {
    console.log(evt);
  }

  onSearch(evt: MouseEvent) {
    console.log(evt);
  }

}