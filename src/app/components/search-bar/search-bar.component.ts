import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { faSearch, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpService, SearchResults } from 'src/app/services/http/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Weather } from 'src/app/models/WeatherContainer';
import { ForecastService } from 'src/app/services/forecast/forecast.service';

@Component({
  selector: 'weathery-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  faSearch = faSearch;
  faCrosshairs = faCrosshairs;

  location: FormControl;
  
  tempClass: string;

  waitingSearch: boolean;
  searchResults: SearchResults;
  selected: number;
  selectedClass: string;

  constructor(
    private weatherService: WeatherService,
    private forecastService: ForecastService,
    private httpService: HttpService,
    private storageService: StorageService
  ) {
    this.location = new FormControl('Loading...');
  }

  ngOnInit() {
    this.location.valueChanges.pipe(debounceTime(500)).subscribe(this.onSearch.bind(this));

    this.weatherService.onWeather$()
    .subscribe(container => {
      const lastWeather = this.storageService.getObject('weather') as Weather;
      if (lastWeather && container.getWeather().dt === lastWeather.dt) return;
      this.setWeather(container.getWeather());
      this.tempClass = container.getTempClass();
      this.selectedClass = container.getTempClassDark();
    });

    this.weatherService.onError$().subscribe(err => {
      switch (err.code) {
      case 1:
        alert('Location denied');
        break;
      case 2:
        alert('Location unavailable');
        break;
      case 3:
        alert('Location timed out');
        break;
      }
    });
  }

  ngAfterViewInit() {
    const weather = this.storageService.getObject('weather') as Weather;
    if (weather) {
      this.onResultSelected(weather.id);
      this.storageService.set('weather', undefined);
    } else {
      this.onGeolocation();
    }
  }

  onGeolocation() {
    this.waitingSearch = true;
    this.weatherService.requestWeatherByBeoCoords();
    this.forecastService.requestForecastByBeoCoords();
  }

  onSearch(value: string) {
    if (this.waitingSearch) {
      this.waitingSearch = false;
      return;
    }
    const [name, country] = value.split(',').map(s => s.trim());
    this.httpService.getLocationsByName(name, country, 5).subscribe(res => {
      if (!res || !res.size) {
        this.searchResults = undefined;
        return;
      }
      this.searchResults = res;
    });
  }

  onHover(i: number) {
    this.selected = i;
  }

  onClick(i: number) {
    const city = this.searchResults.results[i].city;
    this.onResultSelected(city.id);
  }

  private onResultSelected(id: number) {
    this.waitingSearch = true;
    this.searchResults = undefined;
    this.weatherService.requestWeatherByID(id);
    this.forecastService.requestForecastByID(id);
  }

  setWeather(weather: Weather) {
    this.location.setValue(`${weather.name},${weather.sys.country}`);
    this.storageService.set('weather', weather);
  }

}
