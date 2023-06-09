import { Component,OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
} from '@angular/google-maps';
import { ActivatedRoute, Router} from '@angular/router';
import { AlertController } from '@ionic/angular'; 
import { LoadingService } from '../services/loading.service';
import { AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { LocationServiceService } from '../services/location-service.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-locate-me-edit',
  templateUrl: './locate-me-edit.page.html',
  styleUrls: ['./locate-me-edit.page.scss'],
})
export class LocateMeEditPage implements OnInit {
  height : string;
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;
  noAddressError;
  address = '';
  latitude!: any;
  longitude!: any;
  zoom = 18;
  maxZoom = 18;
  minZoom = 8;
  oldLat;
  oldLang;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    //disableDefaultUI: true,
    mapTypeId: 'roadmap',
  };

  markers = [] as any;
  addressId;

  constructor(private ngZone: NgZone, 
    private geoCoder: MapGeocoder,
    private _router: Router,
    private route : ActivatedRoute,
    private loading :LoadingService,
    private _addressService: AddressapiServiceProxy,
    private locationService : LocationServiceService,
    public alertController: AlertController) {
  }

  async presentAlert(header: string, msg: string, subHeader: string) {
    const alert = await this.alertController.create({
      cssClass: 'app-alert',
      header: header,
      subHeader: subHeader,
      message: msg,
      buttons: ['حسنا']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }
  async checkPermissions ()  {
    const hasPermission = await this.locationService.checkGPSPermission();
    if (hasPermission) {
        if (Capacitor.isNative) {
            const canUseGPS = await this.locationService.askToTurnOnGPS();
            this.postGPSPermission(canUseGPS);
        }
        else {
            this.postGPSPermission(true);
        }
    }
    else {
        console.log('14');
        const permission = await this.locationService.requestGPSPermission();
        if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
            if (Capacitor.isNative) {
                const canUseGPS = await this.locationService.askToTurnOnGPS();
                this.postGPSPermission(canUseGPS);
            }
            else {
                this.postGPSPermission(true);
            }
        }
        else {
            this.presentAlert("",'User denied location permission', null);
        }
    }
  }
  
  async postGPSPermission  (canUseGPS: boolean)  {
    if (canUseGPS) {
        await this.getLocation();
    }
    else {
  
      await this.presentAlert('تأكيد', 'لتحديد العنوان بشكل الأفضل يرجى تفعيل خاصية المواقع من الجوال', null);
      }
    }
    async ngOnInit(){
      await  this.checkPermissions();
     }

  async getLocation() {
    this.addressId = this.route.snapshot.paramMap.get('id');
 
 
    try{
      await this.presentAlert('معلومات','لتحديد موقع عنوان جديد على الخريطة يتم تحريك الدبوس الأحمر نحو الموقع المطلوب', null);
      this._addressService.getbyid(this.addressId).subscribe((res)=>{
        this.oldLang =res.longitude;
        this.oldLat = res.latitude;
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = this.oldLat;
          this.longitude = this.oldLang;
          console.log("original"+position.coords.latitude);
          console.log("saved"+this.oldLat);
          this.center = {
            lat: this.oldLat,
            lng: this.oldLang,
          };
          // Set marker position
          this.setMarkerPosition(this.latitude, this.longitude);
          this.getAddress(this.latitude, this.longitude);
          
        },async (error)=>{
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
        });
       });
  
    
     // }
/*   else{
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
  } */
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

  setMarkerPosition(latitude: any, longitude: any) {
    // Set marker position
    this.markers = [
      {
        position: {
          lat: latitude,
          lng: longitude,
        },
        options: {
          animation: google.maps.Animation.DROP,
          draggable: true,
        },
      },
    ];
  }

  eventHandler(event: any, name: string) {
    // console.log(event, name);

    switch (name) {
      case 'mapDblclick': // Add marker on double click event
        break;

      case 'mapDragMarker':
        break;

      case 'mapDragend':
        this.getAddress(event.latLng.lat(), event.latLng.lng());
        break;

      default:
        break;
    }
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder
      .geocode({ location: { lat: latitude, lng: longitude } })
      .subscribe((addr: MapGeocoderResponse) => {
        if (addr.status === 'OK') {
          if (addr.results[0]) {
            this.zoom = 18;
            this.address = addr.results[0].formatted_address;
            console.log(addr);
            console.log(addr.results[0].formatted_address);
            console.log(latitude,longitude);
            this.latitude = latitude;
            this.longitude = longitude;
          } else {
            this.address = null;
            window.alert('No results found');
          }
        } else {
          this.address = null;
          window.alert('Geocoder failed due to: ' + addr.status);
        }
      });
  }
  saveAddress(){
    console.log(this.latitude);
    console.log(this.longitude);
    console.log(this.address);
    if(this.address==''){
      this.noAddressError = "الرجاء اختيار موقع من الخريطة";
    }
    else{
      this._router.navigate(['/edit-addres',this.addressId,this.latitude,this.longitude,this.address],{replaceUrl:true});
    }
  }

}
