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
        return new ForecastContainer().setForecast(forecast);
    }

    constructor() { }

    setForecast(forecast: Forecast) {
        const newContainer = new ForecastContainer();
        newContainer.weathers = forecast.list.map(weather => WeatherContainer.from(weather));
        newContainer.forecast = forecast;
        newContainer.location = `${forecast.city.name},${forecast.city.country}`;
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
