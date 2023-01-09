import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { OrderapiServiceProxy,UserAddress,AddressType,AddressapiServiceProxy,Order, OrderDetail, OrderDetailRequest, OrderRequestModel, PaymentCompany,PaymentcompanyapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AlertController } from '@ionic/angular';  
import { AppSessionService } from 'src/shared/session/app-session.service';
import { Geolocation} from '@capacitor/geolocation';
import { AppConsts } from 'src/shared/AppConsts';
import { BackgroundGeolocationService } from '../services/background-geolocation.service';
import { ActionSheetController } from '@ionic/angular';
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
  googleAddress;
  orderRequest: OrderRequestModel=new OrderRequestModel();
  showGoogleMap =false;
  userLatitude=0;
  userLongitude=0;
  currentPosition = false;
  hasAddress= false;
  addressId;
  deliverAddress;
  AppConsts = AppConsts;
  
  constructor(
    private _session: AppSessionService,
    public cart: CartStoreService,
    private _router: Router,
    private _orderService: OrderapiServiceProxy,
    private _paymentCompanyService: PaymentcompanyapiServiceProxy,
    private _addressApiService : AddressapiServiceProxy,
    public alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private bgGeolocation:BackgroundGeolocationService
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
    radio_options.push({
      text: 'موقعي الآن',
      icon : 'navigate-outline',
      handler: () => {
        this.selectAddress(0)
      }
    });
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
    this.items=[];
    this.autocomplete.query="";
   
     navigator.geolocation.getCurrentPosition((position) => {
      this.currentLat = position.coords.latitude
      this.currentLon = position.coords.longitude
             });  
  } 
  chooseItem(item: any) {
    console.log('modal > chooseItem > item > ', item);
    console.log(item)
    this.selectedItem = item;
    this.items = [];
    this.autocomplete.query = item.structured_formatting.main_text + " - " + item.structured_formatting.secondary_text;
    console.log("description "+item.description)
    this.googleAddress = item.description;
    this.buttonDisabled = false;
    if (item.structured_formatting.secondary_text.indexOf(",")>0){
      let lieuSplitted = item.structured_formatting.secondary_text.split(",",1); 
      this.destinationCity  = lieuSplitted[0]
    }
    else{
      this.destinationCity  = item.structured_formatting.main_text
    }
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

  async selectAddress(id:any){
   /* if( id==0){
      this.showGoogleMap = true;
      this.userAddress.address="";
      this.userAddress.city="";
      this.userAddress.houseNo="";
      this.userAddress.area="";
    }*/
    this.hasAddress = false;
    if( id == 0){
      try{
        const turnOnGPS = await this.bgGeolocation.askToTurnOnGPS();
        if(turnOnGPS){
          this.deliverAddress ="موقعي الآن";
          console.log(id);
          const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
      
         navigator.geolocation.getCurrentPosition((pos)=>{
          const crd = pos.coords;
          
          console.log('Your current position is:');
          console.log(`Latitude : ${crd.latitude}`);
          console.log(`Longitude: ${crd.longitude}`);
          console.log(`More or less ${crd.accuracy} meters.`);
          this.userLatitude = crd.latitude;
          this.userLongitude = crd.longitude;
          console.log(this.userLatitude,this.userLongitude);
          this.currentPosition = true;
          this.hasAddress = true;
         } ,
         async (err)=>{
          this.hasAddress = false;
          console.warn(`ERROR(${err.code}): ${err.message}`);
          const alert = await this.alertController.create({
           header: 'تأكيد ',
           subHeader :  "عذرا لم نتمكن من الوصول إلى موقعك",
            buttons: [
             {
                text: 'حسنا',
                handler: () => { //takes the data 
           
                
                }   
             },
       
                    ],
    
                                        });
    
           await alert.present();
         
        }, options);
        }
        else{

      const alert = await this.alertController.create({
        header: 'تأكيد ',
        subHeader :     "لا يوجد سماحيات للوصول إلى الموقع \n" +
                       "الرجاء تشغيل GPS.\n\n",
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
      catch(error){
        const alert = await this.alertController.create({
          header: 'تأكيد ',
          subHeader :     "لا يوجد سماحيات للوصول إلى الموقع \n" +
                         "الرجاء تشغيل GPS.\n\n",
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
    else if( id==='new'){
      console.log(id);
      this._router.navigate(['/locate-me'])
    }
    else {
      this.hasAddress = true;
      console.log(id);
      this.addressId=id;
      this._addressApiService.getbyid(id).subscribe((res: UserAddress) => 
      {this.userAddress = res;
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
    console.log(e);
    if(e.detail.checked){
      this.showDetailes = true;
    }
    else{
      this.showDetailes = false;
    }
  }
  async sendOrder() {
    console.log(this.userLatitude,this.userLongitude);
    if(this.hasAddress)
    {
   this.withAlert("هل أنت متأكد من تثبيت الطلب؟", () =>{
     
    var totalQty=0;
    this.cart.Items.forEach(element => {
      totalQty+=element.quantity;
    });
   if(this.currentPosition){
    this.orderRequest.area="unidentified";
    this.orderRequest.city="unidentified";
    this.orderRequest.houseNo="unidentified";
    this.orderRequest.address="unidentified";
    this.orderRequest.deliverLatitude=this.userLatitude;
    this.orderRequest.deliverLongitude=this.userLongitude;
    //this.orderRequest.addressId = null;
   }
   else{
    this.orderRequest.area=this.userAddress.area;
    this.orderRequest.city=this.userAddress.city;
    this.orderRequest.houseNo=this.userAddress.houseNo;
    this.orderRequest.address=this.userAddress.address;
    this.orderRequest.deliverLatitude=this.userAddress.latitude;
    this.orderRequest.deliverLongitude=this.userAddress.longitude;
    this.orderRequest.addressId = this.addressId;
    if(Boolean(this.googleAddress)){
      this.orderRequest.address=this.googleAddress;
    }
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
        vendorId:element.product.createdBy
      });
      this.orderRequest.orderDetail.push(orderDetail);
    });
    this._orderService.create(this.orderRequest).subscribe(
      (res) => {
          console.log('res is ', res);
          this.cart.clearCart();
          this._router.navigate(['/invoice',res]);
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
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
