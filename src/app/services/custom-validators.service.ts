import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorsService {
  constructor(private productService: ProductsService) {}

  checkIdNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.productService.getValidation(control.value)
        .pipe(
          map(isTaken => {            
            return isTaken ? { idTaken: true } : null;
          }),
          catchError(() => of(null))
        );
    };
  }

}
