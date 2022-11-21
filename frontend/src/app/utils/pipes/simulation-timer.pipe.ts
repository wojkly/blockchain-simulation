import { Pipe, PipeTransform } from '@angular/core';
import {DAY_STEPS} from "../constants";

@Pipe({
  name: 'simulationTimer'
})
export class SimulationTimerPipe implements PipeTransform {

  transform(stepCount: number): string {
    const totalDays = Math.floor(stepCount / DAY_STEPS);
    const years = Math.floor(totalDays / 360);
    const months = Math.floor((totalDays - years * 360) / 30);
    const days = totalDays % 30;

    if (years > 0) {
      return years.toString() + ' years ' + months.toString() + ' months ' + days.toString() + ' days';
    }
    if (months > 0) {
      return months.toString() + ' months ' + days.toString() + ' days';
    }
    return days.toString() + ' days';
  }

}
