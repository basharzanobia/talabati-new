import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { OrderapiServiceProxy, Order, OrderDetail } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  address = "";
  notes = "";

  constructor(
    public cart: CartStoreService,
    private _router: Router,
    private _orderService: OrderapiServiceProxy
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

  sendOrder() {
    const order = new Order();
    order.init({
      address: this.address,
      area: 'area',
      city: 'city',
      houseNo: 'houseNo',
      state: 'state',
      name: 'name',
      middleName: 'middle name',
      lastName: 'lastname',
      mobile: 'mobile',
      orderNotes: this.notes,
      grandTotal: this.cart.Total,
      orderDetail : []
    });
    this.cart.Items.forEach(element => {
      const orderDetail = new OrderDetail();
      orderDetail.init({
        productId: element.product.id,
        qty: element.quantity,
        price: element.product.price
      });
      order.orderDetail.push(orderDetail);
    });
    this._orderService.create(order).subscribe(
      (res) => {
          this._router.navigate(['/invoice']);
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        console.log('error ', error);
      });
  }

}
