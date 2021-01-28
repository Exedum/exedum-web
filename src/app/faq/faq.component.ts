import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { WindowsService } from '../windows.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  activeTab = 0;

  constructor(
    private readonly windowsService: WindowsService,
  ) {}

  ngOnInit(): void {
  }

  openApp(): void {
    console.log('open');
    this.windowsService.openMenuItem(AppComponent.appWindowData);
  }

}
