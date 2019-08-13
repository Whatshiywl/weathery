import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';

@Component({
  selector: 'weathery-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {
  @Input() options: string[] = ['Y', 'N'];
  @Output() switch: EventEmitter<string> = new EventEmitter<string>();

  backClass: string;
  sliderClass: string;

  private selected = false;

  constructor(
    private weatherService: WeatherService
  ) {
    this.backClass = 'temp-color-50';
    this.sliderClass = 'temp-color-50-dark';
  }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(weather => {
      this.backClass = weather.getTempClass();
      this.sliderClass = weather.getTempClassDark();
    });
  }

  onChange() {
    this.selected = !this.selected;
    const i = this.selected ? 0 : 1;
    this.switch.emit(this.options[i]);
  }

}
