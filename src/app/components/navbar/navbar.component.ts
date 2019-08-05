import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'weathery-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;
  @Input() location: string;
  @Input() index: number;
  @Output() switch: EventEmitter<'C' | 'F'> = new EventEmitter<'C' | 'F'>();

  options = ['F', 'C'];

  constructor() { }

  ngOnInit() {
  }

  onTempUnitToggle(switchEvent: 'C' | 'F') {
    this.switch.emit(switchEvent);
  }

}
