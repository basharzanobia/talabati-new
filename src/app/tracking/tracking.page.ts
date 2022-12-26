import { Component, OnInit } from '@angular/core';
import { AppOrderStatusType } from 'src/shared/AppEnums';
import { Order, SuborderapiServiceProxy,SubOrder,UserReview,ReviewuserapiServiceProxy, OrderapiServiceProxy,SubOrderModel ,UserlocationapiServiceProxy ,Location} from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { faCab } from "@fortawesome/free-solid-svg-icons";
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
  trackingInterval;
   driverLocation = new Location();
    directionsRenderer = new google.maps.DirectionsRenderer();
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

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  
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
      zoom:22,
      disableDefaultUI:true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement,options);
    this.UpdateUsersLocation();
    this.trackingInterval = setInterval(()=> {
      this.UpdateUsersLocation(); },  30000); // every half minute update driver pins
   }
   UpdateUsersLocation() {
    var  directionsService = new google.maps.DirectionsService();
    var m = this.map;
    var _locations  = [];
    if (this.directionsRenderer != null) {
      this.directionsRenderer.setMap(null);
      this.directionsRenderer = null;
      
      for (let i = 0; i < this.locations.length; i++) {
       this.locations[i].setMap(null);
    }
    this.locations = [];
  }
   this.directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    this.directionsRenderer.setMap(this.map);
    var g = this.directionsRenderer;
    this._userLocation.getlocationforsuborderdriver(this.orderId).subscribe((dLoc :Location) =>{
      this.driverLocation = dLoc; });
        var driverNow = new google.maps.LatLng(this.driverLocation .lat, this.driverLocation .lang);
       /* 
       var loc;
        loc = { lat: this.driverLocation .lat, lng: this.driverLocation .lang };
        const marker = this.createMarker({ position: loc });
        this.locations.push(marker);
        console.log("in ---- ");
        console.log(this.locations.length);
        for (let i = 0; i < this.locations.length; i++) {
          console.log(this.locations[i]);
      }
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
      });*/
      console.log(this.orderAddress);
      var request = {
        origin: driverNow,
        destination: this.orderAddress,
        travelMode: 'DRIVING'
      };
 
      directionsService.route(request, function(result, status) {
        if (status == 'OK') {
          g.setDirections(result);
          var leg = result.routes[ 0 ].legs[ 0 ];
          var start = new google.maps.Marker({
            position: leg.start_location,
            map: m,
            icon: {
              path: faCab.icon[4] as string,
              fillColor: "#0000ff",
              fillOpacity: 1,
              anchor: new google.maps.Point(
                faCab.icon[0] / 2, // width
                faCab.icon[1] // height
              ),
              strokeWeight: 1,
              strokeColor: "#ffffff",
              scale: 0.075,
            },
            
            title: "driver"
            });
            _locations.push(start);
            var end =new google.maps.Marker({
              position: leg.end_location,
              map: m,
              title: "me"
              });
              _locations.push(end);
        }
      });
      this.locations = _locations;
  };  
   makeMarker( position, title ) {
    new google.maps.Marker({
    position: position,
    map: this.map,
    title: title
    });
    }
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
  ionViewWillLeave(){
    console.log("this.trackingInterval "+ this.trackingInterval);
    clearInterval(this.trackingInterval);
  }
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

