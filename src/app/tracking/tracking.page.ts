import { Component, OnInit } from '@angular/core';
import { AppOrderStatusType } from 'src/shared/AppEnums';
import { Order, SuborderapiServiceProxy,SubOrder,UserReview,ReviewuserapiServiceProxy, OrderapiServiceProxy ,UserlocationapiServiceProxy ,Location, OrderStatusType} from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  orderLatitude;
  orderLongitude;
  trackingIntervals = [];
   driverLocation = new Location();
    directionsRenderer = new google.maps.DirectionsRenderer();
    orderInTransit = false;
    _appOrderStatusType = AppOrderStatusType.getName;
  @ViewChild('map',{read: ElementRef,static:false}) mapRef:ElementRef;
  constructor(private _session: AppSessionService,
    private route: ActivatedRoute,
    private _userLocation :UserlocationapiServiceProxy,
    private _subOrderService :SuborderapiServiceProxy,
    private _reviewUserapiService:ReviewuserapiServiceProxy,
    private _orderService: OrderapiServiceProxy,
    public alertController: AlertController,
    private router: Router) {
  }


  
  ngOnInit():void {
    console.log(this.route);
    this.orderId =  Number(this.route.snapshot.paramMap.get('orderId'));
    console.log(this.orderId);
     this._subOrderService.getbyid(this.orderId)
          .subscribe((res:SubOrder) => {
            this.order = res;
            if(res.userId != null){
              this.getReview();
            }
            console.log(this.order);
          
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
   async cancelOrder(){
    if(this.order.orderStatus == OrderStatusType.Pending){
     this.order.orderStatus = OrderStatusType.Canceled;
     this._subOrderService.update(this.order).subscribe((res)=> console.log("updated"));
     this.router.navigate(['/order-canceled']);
    }
    else{
      await this.presentAlert('عذرا', 'لا يمكن الغاء الطلب بعد البدء بتحضيره', null);
    }
  }
  addDriverReview(rate){
    
    const review = new UserReview();
    console.log(this._session.userId);
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

ionViewDidEnter(){
    this._subOrderService.getbyid(this.orderId)
    .subscribe((res:SubOrder) => {
      this._orderService.single(res.orderId).subscribe((res:Order) => {
        this.orderAddress = res.address;
        this.orderLatitude = res.deliverLatitude;
        this.orderLongitude = res.deliverLongitude;
       if(this.order.userId != null){
        this.initMap();
       }
         
        
       
      }); 
    
    });
  }
  initMap(){
    this._userLocation.getlocationforsuborderdriver(this.orderId).subscribe((dLoc :Location) =>{
      this.driverLocation = dLoc;
      let lat = dLoc.lat;   let lang = dLoc.lang;
      const options ={
        center: {lat ,lang},
        zoom:22,
        disableDefaultUI:true
      }
      this.map = new google.maps.Map(this.mapRef.nativeElement,options);
      this.UpdateUsersLocation(); });
      

   }
   UpdateUsersLocation() {
   // console.log(this.orderAddress);
    var  directionsService = new google.maps.DirectionsService();
    var m = this.map;
    var _locations  = [];
    if (this.directionsRenderer != null) {
      this.directionsRenderer.setMap(null);
      this.directionsRenderer = null;
  
   
   this.directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    this.directionsRenderer.setMap(this.map);
    var g = this.directionsRenderer;
    this._userLocation.getlocationforsuborderdriver(this.orderId).subscribe((dLoc :Location) =>{
      this.driverLocation = dLoc; });
        var driverNow = new google.maps.LatLng(this.driverLocation .lat, this.driverLocation .lang);
        var dest =  new google.maps.LatLng(this.orderLatitude, this.orderLongitude);
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
      //console.log(this.orderAddress);
      var request = {
        origin: driverNow,
        destination: dest,
        travelMode: 'DRIVING'
      };
      for (var i = 0; i < this.locations.length; i++ ) {
        console.log(this.locations[i])
        this.locations[i].setMap(null);
      }
      this.locations.length = 0;
    }
      directionsService.route(request, function(result, status) {
        if (status == 'OK') {
          g.setDirections(result);
          var leg = result.routes[ 0 ].legs[ 0 ];
         /* var start = new google.maps.Marker({
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
            _locations.push(start);*/
            var end =new google.maps.Marker({
              position: leg.end_location,
              map: m,
              label: {
                color: 'white',
                fontWeight: 'bold',
                text: 'me',
              },
              });
              _locations.push(end);
        }
      });
      this.locations = _locations;
      let trackingInterval = setInterval(()=> {
        this.UpdateUsersLocation(); },  30000); // every half minute update driver pins
        this.trackingIntervals.push(trackingInterval);
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
    for (var i = 0; i < this.trackingIntervals.length; i++ ) {
      console.log(this.trackingIntervals[i]);
      clearInterval( this.trackingIntervals[i]);
    }
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

