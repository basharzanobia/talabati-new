import { Component, OnInit } from '@angular/core';
import { UserAddress, AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { Router ,ActivatedRoute} from '@angular/router';
import { AddressDataService } from '../services/address-data.service';
import { Geolocation} from '@capacitor/geolocation';
import { LoadingService } from '../services/loading.service';
declare var google;
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-addres',
  templateUrl: './addres.page.html',
  styleUrls: ['./addres.page.scss'],
})
export class AddresPage implements OnInit {
  addrInfoForm: FormGroup;
  Myaddress = new UserAddress();
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
  googleAddress;
 // addressTitle: string;
  address: string;
  //area: string;
  //city: string;
  //houseNo: string;
  AppConsts = AppConsts;
latitude;
longitude;
addr;
myPosition;
constructor(  
  private loading :LoadingService,
  private route: ActivatedRoute,
  private _session: AppSessionService,
  private _router: Router,
  private _addressService: AddressapiServiceProxy,
  public addressDataService: AddressDataService
) { this.initPage()}

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
  this.items=[]
  this.autocomplete.query=""
  
  const position = await Geolocation.getCurrentPosition();
   
   if (position) {
    console.log(position)
     this.currentLat = position.coords.latitude
     this.currentLon = position.coords.longitude
   }
  
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
      language:"EN"
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
  ngOnInit() {
   
    console.log("latitude "+this.route.snapshot.paramMap.get('lat'));
    this.latitude = this.route.snapshot.paramMap.get('lat');
    console.log("longitude "+this.route.snapshot.paramMap.get('lang'));
    this.longitude = this.route.snapshot.paramMap.get('lang');
    console.log("adddre "+this.route.snapshot.paramMap.get('addr'));
    this.addr = this.route.snapshot.paramMap.get('addr');
    if(Boolean(this.addr)){
this.myPosition = true;
    }
    this.addrInfoForm = new FormGroup({
      addressTitle: new FormControl(this.Myaddress.addressTitle, [
        Validators.required
      ]),
      area: new FormControl(this.Myaddress.area,[
        Validators.required,
      ]),
      city: new FormControl(this.Myaddress.city,[
        Validators.required,
      ]),
      houseNo: new FormControl(this.Myaddress.houseNo,[
      ]),
      landmark: new FormControl(this.Myaddress.landmark,[
        Validators.required,
      ])
    });
  }
  get addressTitle() {
    return this.addrInfoForm.get('addressTitle')!;
  }
  get area() {
    return this.addrInfoForm.get('area')!;
  }
  get city() {
    return this.addrInfoForm.get('city')!;
  }
  get houseNo() {
    return this.addrInfoForm.get('houseNo')!;
  }
  get landmark() {
    return this.addrInfoForm.get('landmark')!;
  }
  saveAddress()
  { 
   this.loading.present();
    if (this.addrInfoForm.invalid) {
      for (const control of Object.keys(this.addrInfoForm.controls)) {
        this.addrInfoForm.controls[control].markAsTouched();
      }
      return;
    } 
    console.log ("google addr b "+ this.googleAddress);
     // const address = new UserAddress();
      if(!Boolean(this.googleAddress)){
this.googleAddress = this.addr;
console.log ("google addr"+ this.googleAddress);

      }
  /*     address.init({
        userId:this._session.userId,
        addressTitle: this.addressTitle,
        address :this.googleAddress,
        latitude:this.latitude ?? 0,
        longitude : this.longitude ?? 0,
        area:this.area,
        city: this.city,
        houseNo: this.houseNo, 
      }); */

     this.Myaddress = this.addrInfoForm.value;
     this.Myaddress.userId =this._session.userId;
     this.Myaddress.address = this.googleAddress;     
     this.Myaddress.latitude =this.latitude ?? 0;
     this.Myaddress.longitude =  this.longitude ?? 0;
     console.log( this.Myaddress.latitude);
     console.log( this.Myaddress.longitude);
     console.log( this.googleAddress);
     console.log( this.Myaddress.addressTitle);
     console.log( this.Myaddress.area);
     console.log( this.Myaddress.city);
     console.log( this.Myaddress.houseNo);
      this._addressService.createaddress(this.Myaddress).subscribe(
        (res) => {

          this._addressService.getrequestsbyuserid(this._session.userId).subscribe((res: UserAddress[]) => this.addressDataService.initAddresses(res));
            this._router.navigate(['/saved-address']);
          console.log('الرسالة ', 'تم إدخال العنوان');
          this.loading.dismiss();
        },
        async (error) => {
          // Unexpected result!
          // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
          console.log('error ', error);
          this.loading.dismiss();
        }); 
    }  
  }
  

