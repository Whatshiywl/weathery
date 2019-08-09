import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { faSearch, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'weathery-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  faSearch = faSearch;
  faCrosshairs = faCrosshairs;

  location: FormControl;

  // location: string;
  tempClass: string;

  constructor(
    private weatherService: WeatherService
  ) {
    this.location = new FormControl('Loading...');
  }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(container => {
      this.location.setValue(container.getLocation());
      this.tempClass = container.getTempClass();
    });

    this.weatherService.onError$().subscribe(err => {
      switch (err.code) {
      case 1:
        this.location.setValue('Location denied');
        break;
      case 2:
        this.location.setValue('Location unavailable');
        break;
      case 3:
        this.location.setValue('Location timed out');
        break;
      }
    });
  }

  onGeolocation() {
    this.weatherService.requestWeatherByBeoCoords();
  }

  onSearch() {
    this.weatherService.requestWeatherByName(this.location.value);
  }

}
