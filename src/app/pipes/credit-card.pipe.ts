import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'creditCard',
    standalone: true
})
export class CreditCardMaskPipe implements PipeTransform {
    transform(plainCreditCard: string): string {
      return plainCreditCard.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
  }