import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { FaqComponent } from '../faq/faq.component';
import { ProtocolComponent } from '../protocol/protocol.component';
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

  openFAQ(): void {
    this.windowsService.openMenuItem({
      icon: '📜',
      name: 'FAQs',
      goTo: FaqComponent,
      isFullScreen: false,
      isMidScreen: true,
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
    this.windowsService.openMenuItem(AppComponent.appWindowData);
  }

}
