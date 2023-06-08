import { Component, OnInit } from '@angular/core';
import { AppOrderStatusType } from 'src/shared/AppEnums';
import { Order,UserReview,ReviewuserapiServiceProxy,SubOrder,SuborderapiServiceProxy, OrderapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  customFormatter;
  //orders: Order[] = [];
  orders: SubOrder[] = [];
  driverRating : number[] = [];
  vendorRating : number[] = [];
  orderList : Order[] = [];
  segment: string = "going";

  AppConsts = AppConsts;
  AppOrderStatusType = AppOrderStatusType;

  constructor(private _session: AppSessionService,
    private _subOrderService: SuborderapiServiceProxy,
    private _reviewUserapiService:ReviewuserapiServiceProxy,
    private _orderService: OrderapiServiceProxy,
    private router: Router,
    private menuCtrl: MenuController) {

  }

  ngOnInit(): void {
    //this._orderService.getrequestsbycreatorid(this._session.userId).subscribe((res: Order[]) => this.orders = res);
    this._subOrderService.getbycreatorid(this._session.userId).subscribe((res: SubOrder[]) => {
      this.orders = res;
      this.orders.forEach(or => {
       // console.log(or.orderId);
        console.log(or.userId);
        this._orderService.single(or.orderId).subscribe((res2: Order) =>{
          this.orderList[or.id]=res2;
          if(or?.userId !=null){
            console.log(or?.userId)
           // this.getDriverReview(or?.userId);
          }
         
          console.log(or?.vendorId);
          if(or?.vendorId !== null){
        //  this.getVendorReview(or?.vendorId);
      }
        });
      });
    });

  }
  navigateToOrder(orderId){
    this.router.navigate(['/tracking',orderId]);
  }
  goToMenu(){
    this.router.navigate(['/tabs/tab1/1'],{replaceUrl:true});
    this.menuCtrl.toggle();
  }
/*   ionViewWillEnter(){
    this._subOrderService.getbycreatorid(this._session.userId).subscribe((res: SubOrder[]) => {
      this.orders = res;
      this.orders.forEach(or => {
       // console.log(or.orderId);
        console.log(or.userId);
        this._orderService.single(or.orderId).subscribe((res2: Order) =>{
          this.orderList[or.id]=res2;
          if(or?.userId !== null){
            console.log(or?.userId)
         //   this.getDriverReview(or?.userId);
          }
         
          console.log(or?.vendorId);
          if(or?.vendorId !== null){
         // this.getVendorReview(or?.vendorId);
        }
        });
      });
    });
  } */
ionViewWillLeave(){

}
  getDriverReview(userId){
    this._reviewUserapiService.getratingofuser(userId).subscribe(
      (res) => {    
        console.log(res);
        this.driverRating[userId] = res;
      },
      async (error) => {
        console.log('error ', error);
      });
  }

  getVendorReview(vendorId){
    this._reviewUserapiService.getratingofuser(vendorId).subscribe(
      (res) => {    
        console.log(res);
        this.vendorRating[vendorId] = res;
      },
      async (error) => {
        console.log('error ', error);
      });
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  
  addDriverReview(rate,userId){
    
    const review = new UserReview();
    review.init({
      userId:userId,
      raterId:this._session.userId,
      rating:rate
    });

    this._reviewUserapiService.create(review).subscribe(
      (res) => {  
        if(userId !=null)  
        this.getDriverReview(userId);
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        console.log('error ', error);
      });

    }

    addVendorReview(rate,vendorId){
    
      const review = new UserReview();
      review.init({
        userId:vendorId,
        raterId:this._session.userId,
        rating:rate
      });
  
      this._reviewUserapiService.create(review).subscribe(
        (res) => {    
          this.getVendorReview(vendorId);
        },
        async (error) => {
          // Unexpected result!
          // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
          console.log('error ', error);
        });
  
      }

      segmentChanged(ev: any) {
        this.segment = ev.detail.value;
      }

      
}
