import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Telefono, { Events } from 'telefono';
import { Phone } from '../phone/phone';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [Phone],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {

  telefono!: Telefono;
  @ViewChild('phone', { static: true, read: ElementRef }) phone!: ElementRef<HTMLElement>;
  @ViewChild('output', { static: true, read: ElementRef }) output!: ElementRef<HTMLAudioElement>;
  @ViewChild('visualizer', { static: true, read: ElementRef }) visualizer!: ElementRef<HTMLCanvasElement>;


  private subs: Subscription[] = [];

  token?: string;
  isDisconnected: boolean;
  isConnected: boolean;
  isRinging: boolean;
  isOpen: boolean;

  constructor(private route: ActivatedRoute, private cd: ChangeDetectorRef) {
    this.isDisconnected = true;
    this.isConnected = false;
    this.isRinging = false;
    this.isOpen = false;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token') ?? '';
    });

    setTimeout(() => {
      let options = {
        Host: 'localhost',
        Port: 1234,
        Element: this.phone.nativeElement,
        Debug: true,
      };

      this.telefono = new Telefono(options);
    }, 3000)
    this.RegisterEventHandlers();
  }

  RegisterEventHandlers(): void {
    this.subs.push(fromEvent(this.phone.nativeElement, Events.Connected).subscribe((event: any) => {
      this.ConnectedHandler(event);
      this.cd.detectChanges();
    }));

    this.subs.push(fromEvent(this.phone.nativeElement, Events.Ringing).subscribe((event: any) => {
      this.RingingHandler(event);
      this.cd.detectChanges();
    }));
  
    this.subs.push(fromEvent(this.phone.nativeElement, Events.Open).subscribe((event: any) => {
      this.OpenHandler(event);
      this.cd.detectChanges();
    }));
  
    this.subs.push(fromEvent(this.phone.nativeElement, Events.Closed).subscribe((event: any) => {
      this.ClosedHandler(event);
      this.cd.detectChanges();
    }));
  
    this.subs.push(fromEvent(this.phone.nativeElement, Events.Stream).subscribe((event: any) => {
      this.StreamHandler(event);
      this.cd.detectChanges();
    }));
  
    this.subs.push(fromEvent(this.phone.nativeElement, Events.Track).subscribe((event: any) => {
      this.TrackHandler(event);
      this.cd.detectChanges();
    }));
  
    this.subs.push(fromEvent(this.phone.nativeElement, Events.Disconnected).subscribe((event: any) => {
      this.DisconnectedHandler(event);
      this.cd.detectChanges();
    }));
  }

  ConnectedHandler(event: Event) {
    this.isConnected = true;
    this.isRinging = false;
    this.isOpen = false;
    this.isDisconnected = false;
  }

  RingingHandler(event: Event) {
    this.isConnected = false;
    this.isRinging = true;
    this.isOpen = false;
    this.isDisconnected = false;
  }

  OpenHandler(event: Event) {
    this.isConnected = false;
    this.isRinging = false;
    this.isOpen = true;
    this.isDisconnected = false;
  }

  StreamHandler(event: any) {
    // Do simething with the microphone audio stream ...
    // let microphoneStream = event.detail.stream;
    // let tracks = microphoneStream.getTracks();
    // let el = document.createElement('p');
    // document.body.appendChild(el);
    // setInterval(() => {
    //     let str = '';
    //     for (let track of tracks) {
    //         str += '<br />id: ' + track.id + '<br /> ' +
    //         '<b>' + track.label + '</b><br />' +
    //         'deliveredFrames: ' + track.stats.deliveredFrames + '<br />' +
    //         'deliveredFramesDuration: ' + track.stats.deliveredFramesDuration/1000 + 's<br /><hr/>';
    //     }
    //     el.innerHTML = str;
    // }, 1000);
  }

  TrackHandler(event: any) {
    console.log(event.detail)
    let audio = this.output.nativeElement;  

    audio.srcObject = event.detail.streams[0] 
    audio.autoplay = true
    audio.controls = true

    this.AddVisualizer(audio);
  }

  ClosedHandler(event: Event) {
    this.isConnected = true;
    this.isRinging = false;
    this.isOpen = false;
    this.isDisconnected = false;
    this.ResetAudioElements();
  }

  DisconnectedHandler(event: Event) {
    this.isConnected = false;
    this.isRinging = false;
    this.isOpen = false;
    this.isDisconnected = true;
    this.ResetAudioElements();
  }
  
  AddVisualizer(audio: any) {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(audio.srcObject);
      const analyser = audioCtx.createAnalyser();
      source.connect(analyser);

      // Setup canvas
      const canvas = this.visualizer.nativeElement;
      canvas.width = 200;
      canvas.height = 50;
      document.body.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      // Draw waveform
      function draw() {
          requestAnimationFrame(draw);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteTimeDomainData(dataArray);

          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.beginPath();
          for (let i = 0; i < dataArray.length; i++) {
              const x = (i / dataArray.length) * canvas.width;
              const y = (dataArray[i] / 255) * canvas.height;
              ctx?.lineTo(x, y);
              let max = 255;
              let min = 0;
              let red = Math.floor(Math.random() * (max - min + 1)) + min;
              let green = Math.floor(Math.random() * (max - min + 1)) + min;
              let blue = Math.floor(Math.random() * (max - min + 1)) + min;
              if (ctx) {
                ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
              }
          }
          ctx?.stroke();
      }

      draw();
  }

  ResetAudioElements() {
    let audio = this.output.nativeElement;
    audio.autoplay = false;
    audio.controls = false;
    audio.load();

    let canvas = this.visualizer.nativeElement;
    canvas.width = 0;
  }
}
