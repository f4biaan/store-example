import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { Product } from './interfaces/product.interface';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products!: Product[];

  constructor(private productSvc: ProductsService) { }

  ngOnInit(): void {
    this.productSvc.getProduct().pipe(
      tap((products: Product[]) => this.products = products)
    ).subscribe();
  }

}
