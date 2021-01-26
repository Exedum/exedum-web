import { Component, OnInit } from '@angular/core';
import { ComingsoonComponent } from '../comingsoon/comingsoon.component';
import { FrameComponent } from '../frame/frame.component';
import { ProtocolComponent } from '../protocol/protocol.component';
import { SaleComponent } from '../sale/sale.component';
import { WindowsService } from '../windows.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private readonly windowsService: WindowsService,
  ) {}

  ngOnInit(): void {
  }

  openSale(): void {
    this.windowsService.openMenuItem({
      icon: '📡',
      name: 'Sale',
      goTo: SaleComponent,
      isFullScreen: false,
      isMidScreen: false
    });
  }
  openProtocol(): void {
    this.windowsService.openMenuItem({
      icon: '🎚',
      name: 'Protocol',
      goTo: ProtocolComponent,
      isFullScreen: false,
      isMidScreen: true
    });
  }

  openApp(): void {
    this.windowsService.openMenuItem({
      icon: '🚀',
      name: 'App',
      goTo: ComingsoonComponent,
      isFullScreen: true,
      isMidScreen: false
    });
  }

}
