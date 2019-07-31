import { Component, OnInit } from '@angular/core';
import { HttpService, Weather } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'weathery';
  options = ['F', 'C'];
  tempUnit: 'C' | 'F';

  constructor() { }

  ngOnInit() {
  }

  onTempUnitToggle(switchEvent: 'C' | 'F') {
    this.tempUnit = switchEvent;
  }

}
