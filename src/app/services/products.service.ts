import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductInterface } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  _http= inject(HttpClient)

  constructor() { 
   }

   getProducts():Observable<any>{
    return this._http.get<ProductInterface[]>(`${environment.apiEndpoint}bp/products`)
  }
  addProducts(product:ProductInterface):Observable<any>{
    return this._http.post<any>(`${environment.apiEndpoint}bp/products`,product)
  }

  updateProducts(id:string, product:ProductInterface):Observable<any>{
    return this._http.put<any>(`${environment.apiEndpoint}bp/products/${id}`, product)
  }

  getValidation(id:string):Observable<boolean>{
    return this._http.get<boolean>(`${environment.apiEndpoint}bp/products/verification/${id}`)
  }

  deleteProducts(id:string):Observable<boolean>{
    return this._http.delete<any>(`${environment.apiEndpoint}bp/products/${id}`)
  }

}
