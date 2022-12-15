import { Component, OnInit } from '@angular/core';
import { UserAddress, AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { Router ,ActivatedRoute} from '@angular/router';
import { AddressDataService } from '../services/address-data.service';
import { Geolocation} from '@capacitor/geolocation';
declare var google;
@Component({
  selector: 'app-addres',
  templateUrl: './addres.page.html',
  styleUrls: ['./addres.page.scss'],
})
export class AddresPage implements OnInit {
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
  addressTitle: string;
  address: string;
  area: string;
  city: string;
  houseNo: string;
  AppConsts = AppConsts;
latitude;
longitude;
addr;
myPosition;
constructor(  
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
  }
  saveAddress()
  { 
    console.log ("google addr b "+ this.googleAddress);
      const address = new UserAddress();
      if(!Boolean(this.googleAddress)){
this.googleAddress = this.addr;
console.log ("google addr"+ this.googleAddress);

      }
      address.init({
        userId:this._session.userId,
        addressTitle: this.addressTitle,
        address :this.googleAddress,
        latitude:this.latitude ?? 0,
        longitude : this.longitude ?? 0,
        area:this.area,
        city: this.city,
        houseNo: this.houseNo, 
      });
     
      this._addressService.createaddress(address).subscribe(
        (res) => {

          this._addressService.getrequestsbyuserid(this._session.userId).subscribe((res: UserAddress[]) => this.addressDataService.initAddresses(res));
            this._router.navigate(['/saved-address']);
          console.log('الرسالة ', 'تم إدخال العنوان');
        },
        async (error) => {
          // Unexpected result!
          // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
          console.log('error ', error);
        });
    }  
  }
  

