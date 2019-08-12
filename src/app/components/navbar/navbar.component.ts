import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { TempUnit } from '../../models/WeatherContainer';

@Component({
  selector: 'weathery-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;
  
  tempClass: string;
  tempUnitOptions = ['F', 'C'];

  constructor(
    private weatherService: WeatherService
  ) {
    this.tempClass = 'temp-color-50-dark';
  }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(container => {
      this.tempClass = container.getTempClassDark();
    });
  }

  onTempUnitToggle(unit: TempUnit) {
    this.weatherService.setTempUnit(unit);
  }

}
