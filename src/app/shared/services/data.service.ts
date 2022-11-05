import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderDetails } from '../interfaces/order.interface';
import { Store } from '../interfaces/store.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiURL}/stores`);
  }

  saveOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiURL}/orders`, order);
  }

  saveOrdersDetails(details: OrderDetails): Observable<OrderDetails> {
    return this.http.post<OrderDetails>(`${this.apiURL}/detailsOrders`, details);
  }

}
