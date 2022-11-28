import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { OrderapiServiceProxy,UserAddress,AddressType,AddressapiServiceProxy,Order, OrderDetail, OrderDetailRequest, OrderRequestModel, PaymentCompany,PaymentcompanyapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AlertController } from '@ionic/angular';  
import { AppSessionService } from 'src/shared/session/app-session.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  paymentCompaniesVisible=false;
  address = "";
  notes = "";
  PaymentMode = "";
  items_len;
  AddressId = 0;
  PaymentCompanies: PaymentCompany[] = [];
  userAddress:UserAddress=new UserAddress();
  userAddresses:UserAddress[]=[];
  orderRequest: OrderRequestModel=new OrderRequestModel();
  constructor(
    private _session: AppSessionService,
    public cart: CartStoreService,
    private _router: Router,
    private _orderService: OrderapiServiceProxy,
    private _paymentCompanyService: PaymentcompanyapiServiceProxy,
    private _addressApiService : AddressapiServiceProxy,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    console.log('cart ', this.cart.Items);
    this.items_len=this.cart.Items.length;
    this._addressApiService.getrequestsbyuserid(this._session.userId).subscribe((res: UserAddress[]) => this.userAddresses = res);
    this._paymentCompanyService.getallcompanies().subscribe((res: PaymentCompany[]) => this.PaymentCompanies = res);
  }

  showPaymentCompanies(){
    this.paymentCompaniesVisible=true;
  }

  hidePaymentCompanies(){
    this.paymentCompaniesVisible=false;
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

  selectAddress(id:number){
    if( id==0){
      this.userAddress.address="";
      this.userAddress.city="";
      this.userAddress.houseNo="";
      this.userAddress.area="";
    }
    else{
    this._addressApiService.getbyid(id).subscribe((res: UserAddress) => this.userAddress = res);   
    }
  }

  sendOrder() {
    this.withAlert("هل أنت متأكد من تثبيت الطلب؟", () =>{
     
    var totalQty=0;
    this.cart.Items.forEach(element => {
      totalQty+=element.quantity;
    });

    this.orderRequest.area=this.userAddress.area;
    this.orderRequest.city=this.userAddress.city;
    this.orderRequest.houseNo=this.userAddress.houseNo;
    this.orderRequest.address=this.userAddress.address;
    this.orderRequest.totalAmount= this.cart.Total;
    this.orderRequest.grandTotal= this.cart.Total;
    this.orderRequest.totalQty=totalQty;
    this.orderRequest.orderDetail = [];
    this.cart.Items.forEach(element => {
      const orderDetail = new OrderDetailRequest();
      var elementPrice =element.varientId!=0?element.varient.price:element.product.price;
      orderDetail.init({
        productId: element.product.id,
        qty: element.quantity,
        price: elementPrice,
        amount:elementPrice*element.quantity,  
        varientId:element.varientId
      });
      this.orderRequest.orderDetail.push(orderDetail);
    });
    this._orderService.create(this.orderRequest).subscribe(
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
