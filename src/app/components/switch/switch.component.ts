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

  backColor: string;
  sliderColor: string

  private selected = false;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
    this.weatherService.onWeather$()
    .subscribe(weather => {
      this.backColor = weather.getTempClass();
      this.sliderColor = weather.getTempClassDark();
    });
  }

  onChange() {
    this.selected = !this.selected;
    const i = this.selected ? 0 : 1;
    this.switch.emit(this.options[i]);
  }

}
