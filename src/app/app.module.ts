import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { ConvertTempPipe } from './pipes/convert-temp.pipe';
import { SwitchComponent } from './components/switch/switch.component';

@NgModule({
  declarations: [
    AppComponent,
    ConvertTempPipe,
    SwitchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
