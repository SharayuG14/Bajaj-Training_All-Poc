import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowercaseTrunc'
})
export class LowercaseTruncPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    if(!value) return value;
   return value.substring(0,4).toLowerCase();
  }

}
