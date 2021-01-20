import { Component, OnInit } from '@angular/core';
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
    });
  }
  openProtocol(): void {
    this.windowsService.openMenuItem({
      icon: '🎚',
      name: 'Protocol',
      goTo: ProtocolComponent,
      isFullScreen: false,
    });
  }

}
