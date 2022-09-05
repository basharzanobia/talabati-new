import { Component, OnInit } from '@angular/core';
import { AppOrderStatusType } from 'src/shared/AppEnums';
import { Order, OrderapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {
  customFormatter;
  order:Order;
  orderId = 1;

  AppConsts = AppConsts;
  AppOrderStatusType = AppOrderStatusType;


  constructor(private _session: AppSessionService,
    private route: ActivatedRoute,

    private _orderService: OrderapiServiceProxy) {

  }


  
  ngOnInit():void {
    this.orderId =  Number(this.route.snapshot.paramMap.get('orderId'));
     this._orderService.single(this.orderId)
          .subscribe((res:Order) => {
            this.order = res;
          });
  }
}
