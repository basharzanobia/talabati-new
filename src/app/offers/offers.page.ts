import { Component, OnInit } from '@angular/core';
import { AppConsts } from 'src/shared/AppConsts';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { ProductModel, ProductapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  featuredProducts: ProductModel[] = [];
  AppConsts = AppConsts;
  constructor(private productSrevice : ProductapiServiceProxy,
      public cart: CartStoreService) { }

  ngOnInit() {
this.productSrevice.getproductwithdiscount().subscribe((res)=>{
  this.featuredProducts = res;
})
  }
  

}
