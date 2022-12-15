import { Component, OnInit } from '@angular/core';
import { AppOrderStatusType } from 'src/shared/AppEnums';
import { Order,UserReview,ReviewuserapiServiceProxy,SubOrder,SuborderapiServiceProxy, OrderapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';

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

  AppConsts = AppConsts;
  AppOrderStatusType = AppOrderStatusType;

  constructor(private _session: AppSessionService,
    private _subOrderService: SuborderapiServiceProxy,
    private _reviewUserapiService:ReviewuserapiServiceProxy,
    private _orderService: OrderapiServiceProxy) {

  }

  ngOnInit(): void {
    //this._orderService.getrequestsbycreatorid(this._session.userId).subscribe((res: Order[]) => this.orders = res);
    this._subOrderService.getbycreatorid(this._session.userId).subscribe((res: SubOrder[]) => {
      this.orders = res;
      this.orders .forEach(or => {
        this.getDriverReview(or.userId);
        this.getVendorReview(or.vendorId);
      });
    });
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

  addDriverReview(rate,userId){
    
    const review = new UserReview();
    review.init({
      userId:userId,
      raterId:this._session.userId,
      rating:rate
    });

    this._reviewUserapiService.create(review).subscribe(
      (res) => {    
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
}
