import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simulationTimer'
})
export class SimulationTimerPipe implements PipeTransform {

  transform(value: number): string {
    const years = Math.floor(value / 360);
    const months = Math.floor((value - years * 360) / 30);
    const days = value % 30;

    if (years > 0) {
      return years.toString() + ' years ' + months.toString() + ' months ' + days.toString() + ' days';
    }
    if (months > 0) {
      return months.toString() + ' months ' + days.toString() + ' days';
    }
    return days.toString() + ' days';
  }

}
