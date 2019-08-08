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
    "1h": number;
    "3h": number;
  };
  snow: {
    "1h": number;
    "3h": number;
  };
}

export type TempUnit = 'C' | 'F';

export class WeatherContainer {
    private location: string;
    private weather: Weather;
    private comfort: number;
    private icon: {
        src: string,
        alt: string
    };

    constructor(private unit: TempUnit = 'C') { }

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

    private update() {
        this.location = this.weather.name;
        this.comfort = this.calcComfort();
        this.icon = {
            src: `https://openweathermap.org/img/wn/${this.weather.weather[0].icon}@2x.png`,
            alt: this.weather.weather[0].main
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