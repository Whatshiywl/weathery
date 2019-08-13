import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { faSearch, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpService, SearchResults, City } from 'src/app/services/http/http.service';

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
    private httpService: HttpService
  ) {
    this.location = new FormControl('Loading...');
    this.showResults = false;
    this.location.valueChanges.pipe(debounceTime(500)).subscribe((value: string) => {
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
    });
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

  ngAfterViewInit() {
    this.onGeolocation();
  }

  onGeolocation() {
    this.waitingSearch = true;
    this.weatherService.requestWeatherByBeoCoords();
  }

  onResultSelected(selected: City) {
    this.waitingSearch = true;
    this.showResults = false;
    this.weatherService.requestWeatherByID(selected.id);
  }

}
