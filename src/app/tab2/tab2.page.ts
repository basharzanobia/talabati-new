import { Component, OnInit } from '@angular/core';
import { AppOrderStatusType } from 'src/shared/AppEnums';
import { Order,SubOrder,SuborderapiServiceProxy, OrderapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  customFormatter;
  orders: Order[] = [];
  subOrders: SubOrder[] = [];

  AppConsts = AppConsts;
  AppOrderStatusType = AppOrderStatusType;

  constructor(private _session: AppSessionService,
    private _subOrderService: SuborderapiServiceProxy,
    private _orderService: OrderapiServiceProxy) {

  }

  ngOnInit(): void {
    this._orderService.getrequestsbycreatorid(this._session.userId).subscribe((res: Order[]) => this.orders = res);
  }

}
