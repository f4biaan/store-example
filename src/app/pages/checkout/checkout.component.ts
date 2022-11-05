import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
import { Details, Order } from 'src/app/shared/interfaces/order.interface';
import { Store } from 'src/app/shared/interfaces/store.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from '../products/interfaces/product.interface';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  model = {
    name: '',
    store: '',
    shippingAddress: '',
    city: '',
  };

  isDelivery = true;
  cart: Product[] = [];
  stores: Store[] = [];

  constructor(
    private dataSvc: DataService,
    private shoppingCartSvc: ShoppingCartService,
    private router: Router,
    private productsSvc: ProductsService
  ) {
    this.checkIfCartIsEmpty();
  }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }

  onPickupOrDelivery(value: boolean): void {
    this.isDelivery = value;
  }

  onSubmit({ value: formData }: NgForm): void {
    console.log('value', formData);
    const data: Order = {
      ...formData,
      date: this.getCurrentDate(),
      isDelivery: this.isDelivery,
    };
    this.dataSvc
      .saveOrder(data)
      .pipe(
        tap((res) => console.log('Order →', res)),
        switchMap(({ id: orderId }) => {
          const details = this.prepareDetails();
          return this.dataSvc.saveOrdersDetails({ details, orderId });
        }),
        tap(() => this.router.navigate(['/checkout/thank-you-page'])),
        delay(2000),
        tap(() => this.shoppingCartSvc.resetCart())
      )
      .subscribe();
  }

  private getStores(): void {
    this.dataSvc
      .getStores()
      .pipe(tap((stores: Store[]) => (this.stores = stores)))
      .subscribe();
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetails(): Details[] {
    const details: Details[] = [];
    this.cart.forEach((product: Product) => {
      const { id: productId, name: productName, quantity: quantity, stock } = product;
      const updateStock = stock - quantity;
      this.productsSvc.updateStock(productId, updateStock).pipe(
        tap(() => details.push({ productId, productName, quantity }))
      ).subscribe();
    });
    return details;
  }

  private getDataCart(): void {
    this.shoppingCartSvc.cartAction$.pipe(tap((products) => (this.cart = products))).subscribe();
  }

  private checkIfCartIsEmpty(): void {
    this.shoppingCartSvc.cartAction$.pipe(
      tap((products: Product[]) => {
        if (Array.isArray(products) && !products.length) {
          this.router.navigate(['/products']);
        }
      })
    ).subscribe();
  }

}
