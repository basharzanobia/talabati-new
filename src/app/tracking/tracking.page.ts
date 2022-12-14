import { Component, OnInit } from '@angular/core';
import { AppOrderStatusType } from 'src/shared/AppEnums';
import { Order,UserReview,ReviewuserapiServiceProxy, OrderapiServiceProxy,SubOrderModel ,UserlocationapiServiceProxy ,Location} from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { SuborderapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
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
  order:Order;
  orderId = 1;
  driverIds: string[] = [];
  locations = [];
  driversData = [];
  AppConsts = AppConsts;
  AppOrderStatusType = AppOrderStatusType;
  driverRating;

  @ViewChild('map',{read: ElementRef,static:false}) mapRef:ElementRef;
  constructor(private _session: AppSessionService,
    private route: ActivatedRoute,
    private _userLocation :UserlocationapiServiceProxy,
    private _subOrderService :SuborderapiServiceProxy,
    private _reviewUserapiService:ReviewuserapiServiceProxy,
    private _orderService: OrderapiServiceProxy) {
    
  }


  
  ngOnInit():void {
    this.orderId =  Number(this.route.snapshot.paramMap.get('orderId'));
     this._orderService.single(this.orderId)
          .subscribe((res:Order) => {
            this.order = res;
          });
      

  }

  getReview(Review){
    var sum=0;
            var number=0;
            Review.forEach(element=>{
              sum+=element.rating;
              number++
             });
            var rating=sum/number;
            this.driverRating=Math.round(rating);
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
        this.getReview(review);
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
    console.log("initMap");
    const options ={
      center:{ lat: 15.3694, lng: 44.191 },
      zoom:5,
      disableDefaultUI:true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement,options);
    this.UpdateUsersLocation();
   }
   UpdateUsersLocation() {
    console.log("UpdateUsersLocation");
    var loc;
    var i = 0;  
    console.log("UpdateUsersLocation " + i);
    this._userLocation.getlocationsfororderdrivers(this.orderId).subscribe((res :Location[]) =>{
   
      res.forEach( LocationData => {
        console.log("forEach >>");
        i++;
        console.log("getlocationsfororderdrivers subscribe " + i);
        var name = LocationData.driver;
        loc = { lat: LocationData.lat, lng: LocationData.lang };
       
        const marker = this.createMarker({ position: loc });
        this.locations.push(marker);
        marker.setMap(this.map);
    
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
       
    });
    });

  
   this.ResetMap();
  };  
  ResetMap() {
    console.log("ResetMap >>");
    this.hideMarkers();
    this.deleteLocations(); 
    setInterval(()=> {
      this.UpdateUsersLocation(); }, 2 * 60000); // every two min update drivers pins
  };
  hideMarkers() {
    console.log("hideMarkers >>");
    for (let i = 0; i < this.locations.length; i++) {
        this.locations[i].setMap(null);
    }
  }
  deleteLocations() {
    console.log("deleteLocations >>");
    this.locations = [];
  }
   createMarker = ({ position }) => {
    console.log("createMarker >>");
    return new google.maps.Marker({position});
  };
  
}
 



