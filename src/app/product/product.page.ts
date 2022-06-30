import { Component, OnInit } from '@angular/core';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { Product } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  quantity = 0;
  productId = 1;
  product: Product;

  constructor(public cart: CartStoreService) { }

  ngOnInit() {
  }

  slidePrev() {

  }

  slideNext() {
    
  }

  addToCart() {
    this.cart.addToCart({
      productId: this.productId,
      quantity: this.quantity,
      product: this.product
    });
    
  }

}
