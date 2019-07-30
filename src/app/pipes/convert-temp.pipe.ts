import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertTemp'
})
export class ConvertTempPipe implements PipeTransform {

  transform(temp: number, format: 'C' | 'F' | 'K' = 'C'): any {
    format = format.toUpperCase() as 'C' | 'F' | 'K';
    format = ['C', 'F', 'K'].includes(format) ? format : 'C';
    const isCelciusOrFahrenheit = ['C', 'F'].includes(format);
    temp = isCelciusOrFahrenheit ? this.convertKelvinToCelcius(temp) : temp;
    if (format === 'F') {
      temp = this.convertCelciusToFahrenheit(temp);
    }
    const unit = `${isCelciusOrFahrenheit ? '°' : ' '}${format}`;
    return `${Math.round(temp)}${unit}`;
  }

  private convertKelvinToCelcius(kelvin: number) {
    return kelvin - 273.15;
  }

  private convertCelciusToFahrenheit(celcius: number) {
    return celcius * (9 / 5) + 32;
  }

}
