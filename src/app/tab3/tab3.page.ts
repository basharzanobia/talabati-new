import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { OrderapiServiceProxy, OrderDetail, OrderDetailRequest, OrderRequestModel } from 'src/shared/service-proxies/service-proxies';
import { AlertController } from '@ionic/angular';  


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  address = "";
  notes = "";
  items_len;
  constructor(
    public cart: CartStoreService,
    private _router: Router,
    private _orderService: OrderapiServiceProxy,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    console.log('cart ', this.cart.Items);
    this.items_len=this.cart.Items.length;
    
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
  
  async withAlert(message: string, action: () => void) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [{
        text: "إلغاء",
        role: "cancel"
      },
      {
        text: "متأكد",
        handler: action
      }]
    });

    await alert.present();
  }


  sendOrder() {
    this.withAlert("هل أنت متأكد من تثبيت الطلب؟", () =>{
     

    const order = new OrderRequestModel();
    order.init({
      address: '12, street, , sanaa, sss, 123456',
      area: 'area',
      city: 'city',
      houseNo: 'houseNo',
      state: 1,
      name: 'name',
      middleName: 'middle name',
      lastName: 'lastname',
      mobile: 'mobile',
      orderNotes: this.notes,
      grandTotal: this.cart.Total,
      orderDetail : []
    });
    this.cart.Items.forEach(element => {
      const orderDetail = new OrderDetailRequest();
      orderDetail.init({
        productId: element.product.id,
        qty: element.quantity,
        price: element.product.price,
        VendorId:"58705507-ccad-4088-8a72-2be7263773fa",
       
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
    });
  }

}
