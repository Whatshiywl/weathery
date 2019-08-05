import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'weathery-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;
  @Input() location: string;

  options = ['F', 'C'];
  tempUnit: 'C' | 'F';

  constructor() { }

  ngOnInit() {
  }

  onTempUnitToggle(switchEvent: 'C' | 'F') {
    this.tempUnit = switchEvent;
  }

}
