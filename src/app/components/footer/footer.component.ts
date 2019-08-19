import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather/weather.service';
import * as moment from 'moment';

@Component({
  selector: 'weathery-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  tempClass: string;

  questions: number[];

  constructor(
    private weatheryService: WeatherService
  ) { }

  ngOnInit() {
    this.questions = [];
    for (let i = 0; i < 10; i++) {
      this.questions.push(i);
    }

    this.weatheryService.onWeather$()
    .subscribe(container => {
      this.tempClass = container.getTempClassDark();
    });
  }

  getYear() {
    return moment().year();
  }

}
