import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpService } from './services/http/http.service';
import { ConvertTempPipe } from './pipes/convert-temp.pipe';
import { SwitchComponent } from './components/switch/switch.component';
import { CurrentWeatherComponent } from './components/weather/current/current-weather.component';
import { DailyWeatherComponent } from './components/weather/daily/daily-weather.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WeatherService } from './services/weather/weather.service';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    ConvertTempPipe,
    SwitchComponent,
    CurrentWeatherComponent,
    DailyWeatherComponent,
    NavbarComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    HttpService,
    WeatherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
