import { Weather, WeatherContainer, TempUnit } from './WeatherContainer';
import { City } from '../services/http/http.service';
import * as moment from 'moment';

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

    getNextDays() {
        const today = moment().dayOfYear();
        return this.weathers.filter(weather => {
            const weatherWhen = weather.getMoment();
            const hour = weatherWhen.hour();
            const day = weatherWhen.dayOfYear();
            return day !== today && 12 <= hour && hour < 15;
        });
    }

    setUnit(unit: TempUnit) {
        const newContainer = ForecastContainer.from(this.forecast);
        newContainer.weathers = newContainer.weathers.map(weather => weather.setUnit(unit));
        return newContainer;
    }
}
