import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { OrderapiServiceProxy,UserAddress,AddressType,AddressapiServiceProxy,Order, OrderDetail, OrderDetailRequest, OrderRequestModel, PaymentCompany,PaymentcompanyapiServiceProxy, EwalletServiceProxy, VendorapiServiceProxy, SuborderapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AlertController, MenuController } from '@ionic/angular';  
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
  durations =[];
  destinations =[];
  currentSuborderId;
  tmpDurration = 0;
  subOrderIds = [];
  resultOrder:any;
  constructor(
    private _session: AppSessionService,
    public cart: CartStoreService,
    private loading :LoadingService,
    private _router: Router,
    private _orderService: OrderapiServiceProxy,
    private subOrderService : SuborderapiServiceProxy,
    private _paymentCompanyService: PaymentcompanyapiServiceProxy,
    private _addressApiService : AddressapiServiceProxy,
    public alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private bgGeolocation:BackgroundGeolocationService,
    private _ewalletService: EwalletServiceProxy,
    private menuCtrl : MenuController,
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
      cssClass:'apply-order-alert',
      buttons: [{
        text: "غير موافق",
        role: "cancel"
      },
      {
        text: "موافق",
        handler: action
      }]
    });

    await alert.present();
  }
  async withAlertOk(message: string, action: () => void) {
    const alert = await this.alertController.create({
      message: message,
      mode:'ios',
      cssClass:'apply-order-alert',
      buttons: [
      {
        text: "موافق",
        handler: action
      }]
    });

    await alert.present();
  }
  goToMenu(){
    this._router.navigate(['/tabs/tab1/1'],{replaceUrl:true});
    this.menuCtrl.toggle();
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
    console.log(this.userAddress.latitude)
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
 this.withAlert("هل أنت موافق على القيام بتنفيذ الطلب لأنه بالموافقة سيتم الشراء؟", () =>{
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
  this.orderRequest.firstName=this.anotherAddressForm.value['name'];
 }
 if(this.hasAddress){
  this.orderRequest.area=this.userAddress.area;
  this.orderRequest.city=this.userAddress.city;
  this.orderRequest.houseNo=this.userAddress.houseNo;
  this.orderRequest.address=this.userAddress.landmark;
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
  console.log(this.orderRequest.deliverLatitude)
  this._orderService.create(this.orderRequest).subscribe(
    (res) => {
      this.loading.dismiss();
      this.resultOrder =res;
        console.log('res is ', res);
        this.cart.clearCart();
        if(!this.showDetailes){
        //
        // get client destination coords
        // get suborders
        var source =  new google.maps.LatLng(this.orderRequest.deliverLatitude, this.orderRequest.deliverLongitude);
        console.log("calculat duration : client coords ",this.orderRequest.deliverLatitude , " ", this.orderRequest.deliverLongitude);
        this.subOrderService.getbyorderid(res).subscribe((orderdetails)=>{
          for (let i = 0; i < orderdetails.length; i++) {
            var element = orderdetails[i];
            this.subOrderIds.push(element.id);
            this.currentSuborderId = element.id;
            console.log("calculat duration : currentSuborderId ", this.currentSuborderId)
            
            // get vendor coords
            console.log("calculat duration : vendor Id ",element.vendorId);
            this._addressApiService.getrequestsbyuserid(element.vendorId).subscribe((res: UserAddress[]) =>{
           
              var dest =  { lat: res[0].latitude, lng: res[0].longitude };
              this.destinations.push(dest);
              console.log("calculat duration : source coords ",res[0].latitude ,  " ", res[0].longitude);
                // run getDistance and save duration
          var service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
             {
               origins: [source],
               destinations: this.destinations,
               travelMode: 'DRIVING',
               unitSystem: google.maps.UnitSystem.METRIC,
               avoidHighways: false,
               avoidTolls: false,
               language:'ar',
             }, this.callback.bind(this));
             });
          }
        })
      }
      else{
           this._router.navigate(['/invoice',res],{replaceUrl:true});
      }
        //
          
  
      
    },
    async (error) => {
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
  async callback(response, status) {
   // console.log("calculat duration : currentSuborderId inside callback ", this.currentSuborderId);
   console.log("inside callback");
   if (status == 'OK') {
    console.log("distance Ok");
     var origins = response.originAddresses;
     var destinations = response.destinationAddresses;
     for (var i = 0; i < origins.length; i++) {
       var results = response.rows[i].elements;
       for (var j = 0; j < results.length; j++) {
         var element = results[j];
         this.durations.push(element.duration.value);
         console.log("calculat duration : duration ",  element.duration.value);
       }
     }
    if(this.durations.length === this.subOrderIds.length){
        for(let i=0;i< this.subOrderIds.length;i++){
            this.subOrderService.updategoogleduration(this.subOrderIds[i],this.durations[i]).subscribe((res)=>{
                console.log(res)
     }) 
        }
        let max = this.durations[0];
        for(let j= 1;j< this.durations.length;++j){
        if(this.durations[j] > max){
          max = this.durations[j];
        }
        }
        let maxInMinute = Math.ceil(max/60);
        this.withAlertOk( `زمن الوصول المتوقع  للطلب هو بعد ${maxInMinute} دقيقة `, () =>{
          this._router.navigate(['/invoice',this.resultOrder],{replaceUrl:true});
        });
    }
    
   }
 }
}
