import * as moment from 'moment';

export interface Weather {
    base: string;
    clouds: {
        all: number;
    };
    cod: number;
    coord: {
        lat: number;
        lon: number;
    };
    dt: number;
    id: number;
    main: {
        humidity: number;
        pressure: number;
        temp: number;
        temp_max: number;
        temp_min: number;
    };
    name: string;
    sys: {
        country: string;
        id: number;
        message: number;
        sunrise: number;
        sunset: number;
        type: number;
    };
    timezone: number;
    visibility: number;
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    wind: {
        deg: number;
        speed: number;
    };
    rain: {
        '1h': number;
        '3h': number;
    };
    snow: {
        '1h': number;
        '3h': number;
    };
}

export type TempUnit = 'C' | 'F';

export class WeatherContainer {
    private location: string;
    private when: string;
    private weather: Weather;
    private comfort: number;
    private icon: {
        src: string,
        alt: string
    };
    
    private static weatherCondidionMap = {
        clear: {
            d: "Sunny",
            n: "Cleary"
        },
        rain: "Rainy",
        clouds: "Cloudy",
        snow: "Snowy",
        mist: "Misty",
        smoke: "Smoky",
        haze: "Hazy",
        dist: "Dusty",
        fog: "Foggy",
        sand: "Sandy",
        ash: "Ashy",
        squall: "Squally",
        tornado: "\"Tornadoy\"",
        thunderstorm: "Stormy",
        drizzle: "Drizzly",

    };

    static from(weather: Weather) {
        return new WeatherContainer().setWeather(weather);
    }

    constructor(private unit: TempUnit = 'C') {
        moment.updateLocale('en', {
            calendar : {
                sameDay : '[Today]',
                nextDay : '[Tomorrow]',
                nextWeek : 'ddd, D',
                sameElse : 'L'
            } as moment.CalendarSpec
        });
    }

    setWeather(weather: Weather) {
        const newContainer = new WeatherContainer(this.unit);
        newContainer.weather = weather;
        newContainer.update();
        return newContainer;
    }

    getWeather() {
        return this.weather;
    }

    setUnit(unit: TempUnit) {
        const newContainer = new WeatherContainer(unit);
        newContainer.weather = this.weather;
        newContainer.update();
        return newContainer;
    }

    getUnit() {
        return this.unit;
    }

    getLocation() {
        return this.location;
    }

    getComfort() {
        return this.comfort;
    }

    getIcon() {
        return this.icon;
    }

    getTempClass() {
        return `temp-color-${this.comfort}`;
    }

    getTempClassDark() {
        return `temp-color-${this.comfort}-dark`;
    }

    getTempClassLight() {
        return `temp-color-${this.comfort}-light`;
    }

    getMoment() {
        return moment(this.getWeather().dt*1000);
    }

    getWhen() {
        return this.when;
    }

    private update() {
        const weatherInfo = this.weather.weather[0];
        const weatherCondition = weatherInfo.main.toLowerCase();
        let mappedCondition = WeatherContainer.weatherCondidionMap[weatherCondition];
        if (typeof mappedCondition === 'object') {
            const dayMoment = weatherInfo.icon[weatherInfo.icon.length - 1];
            mappedCondition = mappedCondition[dayMoment];
        }
        this.location = `${this.weather.name},${this.weather.sys.country}`;
        this.when = this.getMoment().calendar();
        this.comfort = this.calcComfort();
        this.icon = {
            src: `https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`,
            alt: mappedCondition || (weatherInfo.main = 'y')
        };
    }

    private calcComfort() {
        const mid = 273 + 20;
        const T = this.weather.main.temp - mid;
        const p1 = 20;
        const p2 = 25;
        return Math.round(100 / (Math.exp(-(T / p1 + Math.exp(T / p2) - 1)) + 1));
    }
}
