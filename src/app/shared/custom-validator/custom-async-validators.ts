import { AbstractControl, ValidationErrors } from '@angular/forms';
import { map, Observable, of, switchMap, timer } from 'rxjs';

export class CustomAsyncValidators {
  static createExistsValidator(
    checkFn: (value: string) => Observable<boolean>,
    debounceTime = 500
  ) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(debounceTime).pipe(
        switchMap(() => checkFn(control.value)),
        map((exists) => (exists ? { alreadyExists: true } : null))
      );
    };
  }
}
