import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { faSearch, faCrosshairs } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'weathery-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  faSearch = faSearch;
  faCrosshairs = faCrosshairs;

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
    this.weatherService.requestWeatherByBeoCoords();
  }

  onSearch(evt: MouseEvent) {
    this.weatherService.requestWeatherByName(this.location);
  }

}
