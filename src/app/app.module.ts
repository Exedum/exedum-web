import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DraggableDirective } from './draggable.directive';
import { SaleComponent } from './sale/sale.component';
import { WindowsService } from './windows.service';
import { ProtocolComponent } from './protocol/protocol.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    WelcomeComponent,
    DraggableDirective,
    SaleComponent,
    ProtocolComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [
    WindowsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
