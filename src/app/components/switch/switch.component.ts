import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'weathery-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {
  @Input() options: string[] = ['Y', 'N'];
  @Output() switch: EventEmitter<string> = new EventEmitter<string>();

  @Input() backClass: string;
  @Input() sliderClass: string;

  private selected = false;

  constructor(
  ) { }

  onChange() {
    this.selected = !this.selected;
    const i = this.selected ? 0 : 1;
    this.switch.emit(this.options[i]);
  }

}
