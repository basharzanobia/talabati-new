import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { OrderapiServiceProxy,UserAddress,AddressType,AddressapiServiceProxy,Order, OrderDetail, OrderDetailRequest, OrderRequestModel, PaymentCompany,PaymentcompanyapiServiceProxy, EwalletServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AlertController } from '@ionic/angular';  
import { AppSessionService } from 'src/shared/session/app-session.service';
import { Geolocation} from '@capacitor/geolocation';
import { AppConsts } from 'src/shared/AppConsts';
import { BackgroundGeolocationService } from '../services/background-geolocation.service';
import { ActionSheetController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var google;
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  items: any;
  autocomplete: any;
  acService: any;
  placesService: any;
  selectedItem: any;
  buttonDisabled = true;
  sessionToken: any;
  currentLon: any;
  currentLat: any;
  destinationCity : string;
  zipCode : string="";
  paymentCompaniesVisible=false;
  showDetailes=false;
  address = "";
  notes = "";
  PaymentMode = "";
  items_len;
  AddressId = 0;
  PaymentCompanies: PaymentCompany[] = [];
  userAddress:UserAddress=new UserAddress();
  userAddresses:UserAddress[]=[];
  orderRequest: OrderRequestModel=new OrderRequestModel();
  showGoogleMap =false;
  userLatitude=0;
  userLongitude=0;
  currentPosition = false;
  hasAddress= false;
  addressId;
  deliverAddress;
  AppConsts = AppConsts;
  anotherAddressForm: FormGroup;
  constructor(
    private _session: AppSessionService,
    public cart: CartStoreService,
    private loading :LoadingService,
    private _router: Router,
    private _orderService: OrderapiServiceProxy,
    private _paymentCompanyService: PaymentcompanyapiServiceProxy,
    private _addressApiService : AddressapiServiceProxy,
    public alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private bgGeolocation:BackgroundGeolocationService,
    private _ewalletService: EwalletServiceProxy
  ) { this.initPage();}
  async presentActionSheet() {
    let radio_options = [];
    for(let i=0;i<this.userAddresses.length;++i){
       radio_options.push({
        text : this.userAddresses[i].addressTitle,
        handler: () => {
          this.selectAddress(this.userAddresses[i].id)
        }
      });
    }
  /*   radio_options.push({
      text: 'موقعي الآن',
      icon : 'navigate-outline',
      handler: () => {
        this.selectAddress(0)
      }
    }); */
    radio_options.push({
      text: 'اضافة عنوان جديد',
      icon : 'add-outline',
      handler: () => {
        this.selectAddress('new')
      }
    });
  
    const actionSheet = await this.actionSheetCtrl.create({
      header: ' التوصيل إلى',
      buttons:   radio_options,
  
      
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
  }
  ngOnInit() {
    console.log('cart ', this.cart.Items); 
    this.items_len=this.cart.Items.length;
    this._addressApiService.getrequestsbyuserid(this._session.userId).subscribe((res: UserAddress[]) => this.userAddresses = res);
    this._paymentCompanyService.getallcompanies().subscribe((res: PaymentCompany[]) => this.PaymentCompanies = res);
    this.anotherAddressForm = new FormGroup({
      name: new FormControl(this.orderRequest.firstName, [
        Validators.required
      ]),
      mobile: new FormControl(this.orderRequest.mobile,[
        Validators.required,
      ]),
      city: new FormControl(this.orderRequest.city,[
        Validators.required,
      ]),
      area: new FormControl(this.orderRequest.area,[
        Validators.required,
      ]),
      houseNo: new FormControl(this.orderRequest.houseNo,[
        Validators.required,
      ]),
      address: new FormControl(this.orderRequest.address,[
        Validators.required,
      ])
    },
    );
  }
  async presentAlert() {
    let radio_options = [];
    for(let i=0;i<this.userAddresses.length;++i){
       radio_options.push({
        type: 'radio',
        label : this.userAddresses[i].addressTitle,
        value : this.userAddresses[i].id,
       checked : i === 0
      });
    }
    radio_options.push({
      type: 'radio',
      label : "موقعي الآن"+ '<ion-icon name="navigate-outline"></ion-icon>',
      value : 0,
    });
    radio_options.push({
      type: 'radio',
      label : "اضافة عنوان جديد",
      value : "new",
    });
    const alert = await this.alertController.create({
      header: 'معلومات اضافية',
      message: '',
     
      inputs : radio_options,
    });
  
    await alert.present();
  }
  initPage() {
    // Create a new session token.
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();
    this.acService = new google.maps.places.AutocompleteService();
    this.items = [];
    this.autocomplete = {
      query: ''
    };
  }

  async ionViewWillEnter() {
    this.hideTabBar();
    this.items=[];
    this.autocomplete.query="";
   
     navigator.geolocation.getCurrentPosition((position) => {
      this.currentLat = position.coords.latitude
      this.currentLon = position.coords.longitude
             });  
  } 
ionViewWillLeave(){
  this.showTabBar();
}
  updateSearch() {
    console.log('modal > updateSearch '+this.autocomplete.query);
    if (this.autocomplete.query == '') {
      this.items = [];
      this.buttonDisabled = true
      return;
    }
    let self = this;
    let config: any;
    if (this.currentLat) {
      let myLatLng = new google.maps.LatLng({lat: this.currentLat, lng: this.currentLon}); 
      config = {
        types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
        input: this.autocomplete.query,
        sessionToken: this.sessionToken,
        language: "AR",
        location: myLatLng,
        radius: 500 * 100 ,//50Km
        componentRestrictions: { country: 'YE' } 
      }

    }
    else {
      config = {
        types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
        input: this.autocomplete.query,
        sessionToken: this.sessionToken,
        language:"AR"
        //location: {lat: -34, lng: 151},
        //radius: 1000 * 100 //100Km
        //, 
        //componentRestrictions: { country: 'FR,ES,BE' } 
      }

    }

    console.log(config)
    this.acService.getPlacePredictions(config, function (predictions, status) {
      //console.log('modal > getPlacePredictions > status > ', status);
      self.items = [];
      //console.log("predictions "+JSON .stringify(predictions)) 
      if (predictions) {
        predictions.forEach(function (prediction) {
          self.items.push(prediction);
        });
      }
    });

  }
  dismiss() {
    console.log("Clear search")
    this.items = [];
    this.autocomplete = {
      query: ''
    };
   
  }
  showPaymentCompanies(){
    this.paymentCompaniesVisible=true;
  }
  EWalletPayment(){
console.log(this._session.userId);
this.loading.present();
    this.hidePaymentCompanies();
    this._ewalletService.totalbyuserid(this._session.userId).subscribe(async (res: number) =>
    {
      var totalQty=0;
      this.cart.Items.forEach(element => {
        totalQty+=element.quantity;
      });
      if(res < totalQty){
    
        const alert = await this.alertController.create({
          message: " ليس لديك رصيد كاف في المحفظة. رصيدك الحالي هو"+ totalQty
          + " " +AppConsts.currency + " الرجاء اختيار طريقة دفع أخرى ",
          buttons: [
          {
            text: "موافق",
            handler:()=>{
              this.orderRequest.paymentMode = null;
            }
          }]
        });
        this.loading.dismiss();
      alert.present();
      }
      this.loading.dismiss();
    });
    
    
  
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
  ionViewDidEnter(){
    console.log('did enter');
    this.hideTabBar();
  }

  ionViewDidLeave(){
    this.showTabBar();
  }
   showTabBar  () {
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
      tabBar.style.display = 'block';
    }
  };
   hideTabBar () {
    const tabBar = document.getElementById('app-tab-bar');
    if (tabBar !== null) {
      console.log('did ente 11r');
      tabBar.style.display = 'none';
    }
  };
  clearCart() {
    this.withAlert("هل أنت متأكد من حذف السلة؟", () =>{
      this.cart.clearCart();
      this._router.navigate(['/tabs/tab1/1'],{replaceUrl:true});
    })


  }
  
  async withAlert(message: string, action: () => void) {
    const alert = await this.alertController.create({
      message: message,
      mode:'ios',
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

  async selectAddress(id:any){
  
    this.hasAddress = false;
  if( id==='new'){
      console.log(id);
      this._router.navigate(['/locate-me'])
    }
    else {
      this.loading.present();
      this.hasAddress = true;
      console.log(id);
      this.addressId=id;
      this._addressApiService.getbyid(id).subscribe((res: UserAddress) => 
      {
        this.loading.dismiss();
        this.userAddress = res;
        this.deliverAddress = res.addressTitle;
      });  
     
      }
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  
  ShowDetailes(e){
    this.hasAddress = false;
    if(e.detail.checked){
      this.showDetailes = true;
    }
    else{
      this.showDetailes = false;
    }
  }
  async sendOrder() {
    if(this.showDetailes){
      if (this.anotherAddressForm.invalid) {
        for (const control of Object.keys(this.anotherAddressForm.controls)) {
          this.anotherAddressForm.controls[control].markAsTouched();
        }
        return;
      } 
      console.log(this.hasAddress)
    }
if(this.orderRequest.paymentMode == null){

  const alert = await this.alertController.create({
    header: 'تأكيد ',
    subHeader : "الرجاء ادخال طريقة دفع",
    buttons: [
      {
        text: 'حسنا',
            handler: () => { //takes the data 
       
            
            }   
    },
   
    ],

  });

  await alert.present();
}
else{
  if(this.hasAddress || this.showDetailes)
  {
 this.withAlert("هل أنت متأكد من تثبيت الطلب؟", () =>{
  this.loading.present();
  var totalQty=0;
  this.cart.Items.forEach(element => {
    totalQty+=element.quantity;
  });
 if(this.showDetailes){
  this.orderRequest.area=this.anotherAddressForm.value['area'];
  this.orderRequest.city=this.anotherAddressForm.value['city'];
  this.orderRequest.houseNo=this.anotherAddressForm.value['houseNo'];
  this.orderRequest.address=this.anotherAddressForm.value['address'];
 }
 if(this.hasAddress){
  this.orderRequest.area=this.userAddress.area;
  this.orderRequest.city=this.userAddress.city;
  this.orderRequest.houseNo=this.userAddress.houseNo;
  this.orderRequest.address=this.userAddress.address;
  this.orderRequest.deliverLatitude=this.userAddress.latitude;
  this.orderRequest.deliverLongitude=this.userAddress.longitude;
  this.orderRequest.addressId = this.addressId;
  
 }

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
      varientId:element.varientId,
      vendorId:element.product.createdBy,
      notes : element.note
    });
    this.orderRequest.orderDetail.push(orderDetail);
  });
  this._orderService.create(this.orderRequest).subscribe(
    (res) => {
      this.loading.dismiss();
        console.log('res is ', res);
        this.cart.clearCart();
        this._router.navigate(['/invoice',res],{replaceUrl:true});
    },
    async (error) => {
      // Unexpected result!
      // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
      this.loading.dismiss();
      console.log('error ', error);
    });
  });
  }
  else{
   
    const alert = await this.alertController.create({
      header: 'تأكيد ',
      subHeader : "الرجاء ادخال عنوان استلام",
      buttons: [
        {
          text: 'حسنا',
              handler: () => { //takes the data 
         
              
              }   
      },
     
      ],
  
    });
  
    await alert.present();
  }
}
 
 
  }

}
