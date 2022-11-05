import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiURL = 'http://localhost:3000/products'; // in port 300 is running the json-server
  constructor(private http: HttpClient) { }

  getProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL);
  }

  updateStock(productId: number, stock: number): Observable<any> {
    const body = {"stock": stock};
    return this.http.patch<Product[]>(`${this.apiURL}/${productId}`, body);
  }

}
