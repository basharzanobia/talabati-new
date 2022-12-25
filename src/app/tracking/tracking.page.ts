import { Component, OnInit } from '@angular/core';
import { AppOrderStatusType } from 'src/shared/AppEnums';
import { Order, SuborderapiServiceProxy,SubOrder,UserReview,ReviewuserapiServiceProxy, OrderapiServiceProxy,SubOrderModel ,UserlocationapiServiceProxy ,Location} from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';

import { interval } from 'rxjs';
declare var google:any;
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {
  map: any;
  customFormatter;
  order:SubOrder = new SubOrder();
  orderId = 1;
  driverIds: string[] = [];
  locations = [];
  driversData = [];
  AppConsts = AppConsts;
  AppOrderStatusType = AppOrderStatusType;
  driverRating;
  orderAddress;
  @ViewChild('map',{read: ElementRef,static:false}) mapRef:ElementRef;
  constructor(private _session: AppSessionService,
    private route: ActivatedRoute,
    private _userLocation :UserlocationapiServiceProxy,
    private _subOrderService :SuborderapiServiceProxy,
    private _reviewUserapiService:ReviewuserapiServiceProxy,
    private _orderService: OrderapiServiceProxy) {
    
  }


  
  ngOnInit():void {
    console.log(this.route);
    this.orderId =  Number(this.route.snapshot.paramMap.get('orderId'));
    console.log(this.orderId);
     this._subOrderService.getbyid(this.orderId)
          .subscribe((res:SubOrder) => {
            this.order = res;
            this.getReview();
            console.log(this.order);
            this._orderService.single(res.orderId).subscribe((res:Order) => {
              this.orderAddress = res.address;
            });
          });
         

  }

  getReview(){
    this._reviewUserapiService.getratingofuser(this.order.userId).subscribe(
      (res) => {    
        console.log(res);
        this.driverRating = res;
      },
      async (error) => {
        console.log('error ', error);
      });
  }

  addDriverReview(rate){
    
    const review = new UserReview();
    review.init({
      userId:this.order.userId,
      raterId:this._session.userId,
      rating:rate
    });

    this._reviewUserapiService.create(review).subscribe(
      (res) => {    
        this.getReview();
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        console.log('error ', error);
      });
}

  ngAfterViewInit():void{
    this.initMap();
  }
  initMap(){
   
    const options ={
     // center:{ lat: 15.3694, lng: 44.191 },
     center: this.orderAddress,
      zoom:18,
      disableDefaultUI:true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement,options);
    this.UpdateUsersLocation();
   }
   UpdateUsersLocation() {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    
    directionsRenderer.setMap(this.map);
    console.log("UpdateUsersLocation");
    var loc;
    var i = 0;  
    this._userLocation.getlocationsfororderdrivers(this.orderId).subscribe((res :Location[]) =>{
   
      res.forEach( LocationData => {
        i++;
        console.log("inside subscribe ");
        var name = LocationData.driver;
        loc = { lat: LocationData.lat, lng: LocationData.lang };
        var driverNow = new google.maps.LatLng(LocationData.lat, LocationData.lang);
        const marker = this.createMarker({ position: loc });
        this.locations.push(marker);
        marker.setMap(this.map);
        //this.map.panTo(marker.getPosition());
        const contentString ='<div id="infowindow" style="margin-right:30px;font-weight:bold">' + `${name}`+"</div>"; ;
            
        const infowindow = new google.maps.InfoWindow({
            content: contentString,
        });
        marker.addListener("click", () => {
          infowindow.open({
              anchor: marker,
              shouldFocus: false,
          });
      });
      console.log(this.orderAddress);
      var request = {
        origin: driverNow,
        destination: this.orderAddress,
        travelMode: 'DRIVING'
      };
      directionsService.route(request, function(result, status) {
        if (status == 'OK') {
          directionsRenderer.setDirections(result);
        }
      });
       
    });
    });

  
   this.ResetMap();
  };  

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };
  

  
  ResetMap() {
    this.hideMarkers();
    this.deleteLocations(); 
    setInterval(()=> {
      this.UpdateUsersLocation(); },  30000); // every min update drivers pins
  };
  hideMarkers() {
    for (let i = 0; i < this.locations.length; i++) {
        this.locations[i].setMap(null);
    }
  }
  deleteLocations() {
    this.locations = [];
  }
   createMarker = ({ position }) => {
    console.log("marker creating ..");
    return new google.maps.Marker({position});
  };
  
}
 

function calculateAndDisplayRoute(directionsService: any, directionsRenderer: any,source:any,dest:any) {
  directionsService
  .route({
      origin: {
          query: source,
      },
      destination: {
          query: dest,
      },
      travelMode: google.maps.TravelMode.DRIVING,
  })
  .then((response) => {
      directionsRenderer.setDirections(response);
  })
  .catch((e) => window.alert("Directions request failed"));
}

