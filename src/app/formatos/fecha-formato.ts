import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fechaFormato'
})
export class fechaFormato implements PipeTransform {
  transform(value: string): string {
    return moment(value).format('DD-MM-YYYY HH:mm:ss');
  }
}