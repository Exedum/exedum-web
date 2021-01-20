import { AfterViewInit, Component, ComponentFactoryResolver, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { MenuItem } from './menu.item';
import { ProtocolComponent } from './protocol/protocol.component';
import { RegisterComponent } from './register/register.component';
import { SaleComponent } from './sale/sale.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WindowsService } from './windows.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  menu: MenuItem[] = [
    {
      icon: '📕',
      name: 'Welcome',
      goTo: WelcomeComponent,
      isFullScreen: false,
    },
    {
      icon: '🎚',
      name: 'Protocol',
      goTo: ProtocolComponent,
      isFullScreen: false,
    },
    {
      icon: '📡',
      name: 'Sale',
      goTo: SaleComponent,
      isFullScreen: false,
    },
    {
      icon: '🚀',
      name: 'App',
      goTo: RegisterComponent,
      isFullScreen: true,
    },
    {
      icon: '🤖',
      name: 'Github',
      goTo: 'https://github.com/exedum',
      isFullScreen: false,
    },
    /* {
      icon: '🦄',
      name: 'Trade',
      goTo: 'https://github.com/exedum',
    }*/
  ];

  date = new Date();
  startMenuOpened = false;
  lastZIndex = 10;
  lastWindowOpened = 0;
  openedWindows = [
    {
      component: WelcomeComponent,
      zIndex: this.lastZIndex,
      title: '📕 Welcome',
      isFullScreen: false,
    }
  ];

  @ViewChildren('dynamic', {read: ViewContainerRef})
  public windowTargets: QueryList<ViewContainerRef>;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly windowsService: WindowsService,
  ) {}

  ngAfterViewInit(): void {
    this.loadWindowContentWithDelay(0, this.openedWindows[0].component);
    this.windowsService.openedEvent
      .subscribe((data: MenuItem) => {
        this.openMenuItem(data);
      });
  }

  openMenuItem(item: MenuItem): void {
    if (typeof item.goTo === 'string') {
      window.open(item.goTo, '_blank');
      return;
    }
    this.openComponent(item.goTo, item.icon + ' ' + item.name, item.isFullScreen);
    this.startMenuOpened = false;
  }

  openComponent(component: any, title: string, isFullScreen: boolean): void {
    this.openedWindows = [...this.openedWindows, {
      component,
      zIndex: this.lastZIndex + 1,
      title,
      isFullScreen,
    }];
    this.lastZIndex += 1;
    this.lastWindowOpened = this.openedWindows.length - 1;
    this.loadWindowContentWithDelay(this.openedWindows.length - 1, component);
  }

  closeWindow(index: number): void {
    this.openedWindows.splice(index, 1);
  }

  focusWindow(index: number): void {
    this.openedWindows[index].zIndex = this.lastZIndex + 1;
    this.lastZIndex += 1;
    this.lastWindowOpened = index;
  }

  private loadWindowContentWithDelay(index: number, component: any): void {
    setTimeout(() => {
      this.loadWindowContent(index, component);
    }, 20);
  }

  private loadWindowContent(index: number, component: any): void {
    const target = this.windowTargets.toArray()[index];
    const widgetComponent = this.componentFactoryResolver.resolveComponentFactory(component);
    const ref = target.createComponent(widgetComponent);
    ref.changeDetectorRef.detectChanges();
  }
}
