import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notificationType',
})
export class NotificationTypePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'SYSTEM_ALERT':
        return 'Alert';
      case 'ACCOUNT_ACTIVITY':
        return 'Account Activity';
      default:
        return value;
    }
  }
}
