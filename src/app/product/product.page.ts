import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from 'src/shared/AppConsts';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import {
  Product,
  ProductapiServiceProxy
} 
from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  quantity = 1;
  productId = 1;
  product: Product;
  AppConsts = AppConsts;

  constructor(
    private route: ActivatedRoute,
    public cart: CartStoreService,
    private _productsService: ProductapiServiceProxy) { }

  ngOnInit() {
    this.productId =  Number(this.route.snapshot.paramMap.get('productId'));
    this._productsService.single(this.productId)
          .subscribe((res: Product) => {
            this.product = res;
          });
  }

  addToCart() {
    this.cart.addToCart({
      productId: this.productId,
      quantity: this.quantity,
      product: this.product
    });
    
  }

}
