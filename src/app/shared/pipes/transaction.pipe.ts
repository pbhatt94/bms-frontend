import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionpipe',
})
export class TransactionPipe implements PipeTransform {
  transform(id: string): string {
    if (id && id.length >= 24) {
      const subs = id.substring(24);
      return `TRX-${subs}`;
    } else {
      return 'Invalid ID';
    }
  }
}
