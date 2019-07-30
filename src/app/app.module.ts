import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { ConvertTempPipe } from './pipes/convert-temp.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ConvertTempPipe
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
