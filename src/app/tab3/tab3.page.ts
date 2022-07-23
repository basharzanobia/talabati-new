import { Component } from '@angular/core';
import { CartStoreService } from 'src/shared/cart/cart-store.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    public cart: CartStoreService,
  ) { }

  ngOnInit() {
    console.log('cart ', this.cart.Items);
    
  }

  decItem(i: number) {
    const item = this.cart.Items[i];
    item.quantity = item.quantity > 1 ? item.quantity - 1 : 1;
  }

  incItem(i: number) {
    const item = this.cart.Items[i];
    item.quantity = item.quantity + 1;
  }

  removeItem(i: number) {
    this.cart.removeFromCart(i);
  }

  clearCart() {
    this.cart.clearCart();
  }

}
