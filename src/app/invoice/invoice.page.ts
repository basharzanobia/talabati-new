import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { now } from 'moment';
import { OrderapiServiceProxy,Order, OrderDetail, OrderDetailRequest} from 'src/shared/service-proxies/service-proxies';
import { AppConsts } from 'src/shared/AppConsts';
import {AppPaymentModeType} from 'src/shared/AppEnums';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {

  orderId=0;
  order : Order = new Order();
  orderDate = null;
  AppConsts = AppConsts;
  _appPaymentModeType = AppPaymentModeType.getName;
  constructor(
    private route: ActivatedRoute,
    private _orderService: OrderapiServiceProxy,
    ) { }

  ngOnInit() {
    this.orderId =  Number(this.route.snapshot.paramMap.get('orderId'));
    this._orderService.single(this.orderId).subscribe((res:Order)=>{this.order=res;
      this.orderDate=this.order.createdDate.format('YYYY-MM-DD');
      console.log(this.order)});
  }

}
