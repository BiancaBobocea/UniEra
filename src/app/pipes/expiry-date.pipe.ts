import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expiryDate',
  standalone: true
})
export class ExpiryDatePipe implements PipeTransform {

  transform(value: string): string {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) {
      return '';
    } else if (digits.length === 1) {
        const month = this.padMonth(digits);
        return `${month} / `;
    } else if (digits.length === 2) {
        const month = this.padMonth(digits);
        return `${month} / `;
    } else if (digits.length === 3) {
        const month = this.padMonth(digits.slice(0, 2));
        return `${month} / ${digits.slice(2)}`;
    } else if (digits.length === 4) {
        const month = this.padMonth(digits.slice(0, 2));
        return `${month} / ${digits.slice(2, 4)}`;
    } else {
        // If more than 4 digits, consider it invalid and only use the first 4 digits
        const month = this.padMonth(digits.slice(0, 2));
        return `${month} / ${digits.slice(2, 4)}`;
    }
  }

  padMonth(month: string): string {
    if (month.length === 1) {
        if (parseInt(month[0]) > 1) {
            return `0${month[0]}`
        } else {
            return month[0];
        }
    } 
    else if (parseInt(month, 10) > 12 || month === '00') {
      return '01';
    } else if (month.length === 1) {
      return `0${month}`;
    }
    return month;
  }
}
