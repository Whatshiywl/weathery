import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { faSearch, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpService, SearchResults, City } from 'src/app/services/http/http.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Weather } from 'src/app/models/WeatherContainer';

@Component({
  selector: 'weathery-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  faSearch = faSearch;
  faCrosshairs = faCrosshairs;

  location: FormControl;

  waitingSearch: boolean;
  searchResults: SearchResults;

  showResults: boolean;
  tempClass: string;

  constructor(
    private weatherService: WeatherService,
    private httpService: HttpService,
    private storageService: StorageService
  ) {
    this.location = new FormControl('Loading...');
    this.showResults = false;
  }

  ngOnInit() {
    this.location.valueChanges.pipe(debounceTime(500)).subscribe(this.onSearch.bind(this));

    this.weatherService.onWeather$()
    .subscribe(container => {
      const lastWeather = this.storageService.getObject('weather') as Weather;
      if (lastWeather && container.getWeather().dt === lastWeather.dt) return;
      this.setWeather(container.getWeather());
      this.tempClass = container.getTempClass();
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
        this.showResults = false;
        return;
      }
      this.searchResults = res;
      this.showResults = true;
    });
  }

  onResultSelected(id: number) {
    this.waitingSearch = true;
    this.searchResults = undefined;
    this.showResults = false;
    this.weatherService.requestWeatherByID(id);
  }

  setWeather(weather: Weather) {
    this.location.setValue(`${weather.name},${weather.sys.country}`);
    this.storageService.set('weather', weather);
  }

}
