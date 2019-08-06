import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { TempUnit } from 'src/app/services/weather/WeatherContainer';

@Component({
  selector: 'weathery-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;
  
  location: string;
  locationError: string;
  tempClass: string;
  options = ['F', 'C'];

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(container => {
      this.location = container.getLocation();
      this.tempClass = container.getTempClassDark();
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

  onTempUnitToggle(unit: TempUnit) {
    this.weatherService.setTempUnit(unit);
  }

}
