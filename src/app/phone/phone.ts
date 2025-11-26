import { Component, Input } from '@angular/core';
import { Keypad } from "../keypad/keypad";
import Telefono from 'telefono';

@Component({
  selector: 'phone',
  imports: [Keypad],
  templateUrl: './phone.html',
  styleUrls: ['./phone.scss'],
  standalone: true
})
export class Phone {

  @Input() telefono?: Telefono;

  @Input() callToken?: string;

  constructor() {
  }

  async MakeCall(): Promise<void> {
    await this.telefono?.Call(this.callToken!);
  }

  async HangUp(): Promise<void> {
    await this.telefono?.HangUp();
  }

  OnKeyPressed(event: any) {
    console.log("Key Pressed: ", event);
  }
}
