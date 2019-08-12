import { Weather, WeatherContainer } from './WeatherContainer';
import { City } from '../services/http/http.service';

export interface Forecast {
    cod: number;
    message: string;
    cnt: number;
    list: Weather[];
    city: City;
}
  
export class ForecastContainer {
    private location: string;
    private forecast: Forecast;
    private weathers: WeatherContainer[];

    static from(forecast: Forecast) {
        const newContainer = new ForecastContainer();
        newContainer.setForecast(forecast);
        return newContainer;
    }

    constructor() { }

    setForecast(forecast: Forecast) {
        const newContainer = new ForecastContainer();
        newContainer.weathers = [];
        forecast.list.forEach(weather => {
            newContainer.weathers.push(WeatherContainer.from(weather));
        });
        newContainer.forecast = forecast;
        this.location = `${this.forecast.city.name},${this.forecast.city.country}`;
        return newContainer;
    }
    
    getLocation() {
        return this.location;
    }

    getForecast() {
        return this.forecast;
    }

    getWeatherList() {
        return this.weathers;
    }

    getWeather(index: number) {
        return this.weathers[index];
    }
}