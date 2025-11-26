import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'key',
  imports: [],
  templateUrl: './key.html',
  styleUrls: ['./key.scss'],
  standalone: true
})
export class Key {
  @Output() pressed = new EventEmitter<string>();
  @Input() value: string = '';
  
  constructor() {}

  Press() {
    this.pressed.emit(this.value);
  }
}
