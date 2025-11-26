import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Key } from "../key/key";

@Component({
  selector: 'keypad',
  imports: [Key],
  templateUrl: './keypad.html',
  styleUrls: ['./keypad.scss'],
  standalone: true
})
export class Keypad {
  @Output() keyPressed = new EventEmitter<string>();
  @Output() call = new EventEmitter<boolean>();
  @Output() hangup = new EventEmitter<boolean>();

  onKeyPressed(value: string) {
    this.keyPressed.emit(value);
  }

  Call() {
    this.call.emit(true);
  }

  Hangup() {
    this.hangup.emit(true);
  }
}
