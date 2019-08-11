import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SearchResults, City } from 'src/app/services/http/http.service';
import { WeatherService } from 'src/app/services/weather/weather.service';

@Component({
  selector: 'weathery-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnChanges {
  @Input() search: SearchResults;
  @Output() selected: EventEmitter<City> = new EventEmitter<City>();

  hovered: number;
  selectedClass: string;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
    this.weatherService.onWeather$().subscribe(container => {
      this.selectedClass = container.getTempClassDark();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.search) {
      this.hovered = -1;
    }
  }

  onMouseHover(i: number) {
    this.hovered = i;
  }

  onClick(i: number) {
    const clicked = this.search.results[i].city;
    this.selected.emit(clicked);
  }

}
