import { Component, OnInit } from '@angular/core';
import { AppOrderStatusType } from 'src/shared/AppEnums';
import { Order, OrderapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  customFormatter;
  orders: Order[] = [];

  AppOrderStatusType = AppOrderStatusType;

  constructor(private _session: AppSessionService,
    private _orderService: OrderapiServiceProxy) {

  }

  ngOnInit(): void {
    this._orderService.getrequestsbycreatorid(this._session.userId).subscribe((res: Order[]) => this.orders = res);
  }

}
