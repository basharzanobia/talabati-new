import { Component,OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
} from '@angular/google-maps';
import { ActivatedRoute ,Router} from '@angular/router';
import { AlertController } from '@ionic/angular'; 
import { BackgroundGeolocationService } from '../services/background-geolocation.service';
@Component({
  selector: 'app-locate-me',
  templateUrl: './locate-me.page.html',
  styleUrls: ['./locate-me.page.scss'],
})
export class LocateMePage implements OnInit {
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
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    disableDefaultUI: true,
    mapTypeId: 'roadmap',
  };

  markers = [] as any;

  constructor(private ngZone: NgZone, 
    private geoCoder: MapGeocoder,
    private _router: Router,
    private bgGeolocation:BackgroundGeolocationService,
    public alertController: AlertController) {
   /* this.height = (document.documentElement.clientHeight-100)+"px";*/
  }

 /* ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
    // Align search box to center
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.searchElementRef.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log({ place }, place.geometry.location?.lat());

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();

        // Set marker position
        this.setMarkerPosition(this.latitude, this.longitude);

        this.center = {
          lat: this.latitude,
          lng: this.longitude,
        };
      });
    });
  }*/

  async ngOnInit() {
    try{
      const turnOnGPS = await this.bgGeolocation.askToTurnOnGPS();
      if(turnOnGPS){
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
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
      this._router.navigate(['/addres',this.latitude,this.longitude,this.address]);
    }
  }
}