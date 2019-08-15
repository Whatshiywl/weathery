import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { TempUnit } from '../../models/WeatherContainer';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'weathery-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;

  tempClass: string;

  switchBackClass: string;
  switchSliderClass: string;
  tempUnitOptions = ['F', 'C'];

  constructor(
    private weatherService: WeatherService,
  ) {
    this.tempClass = 'temp-color-50-dark';
    this.switchBackClass = 'temp-color-50';
    this.switchSliderClass = 'temp-color-50-dark';
  }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(container => {
      this.tempClass = container.getTempClassDark();
      this.switchBackClass = container.getTempClass();
      this.switchSliderClass = container.getTempClassDark();
    });
  }

  onTempUnitToggle(unit: TempUnit) {
    this.weatherService.setTempUnit(unit);
  }

}
