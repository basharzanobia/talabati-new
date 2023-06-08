import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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
      public cart: CartStoreService,
      private menuCtrl : MenuController,
      private router : Router) { }

  ngOnInit() {
this.productSrevice.getproductwithdiscount().subscribe((res)=>{
  this.featuredProducts = res;
})
  }

   goToMenu(){
    this.router.navigate(['/tabs/tab1/1'],{replaceUrl:true});
    this.menuCtrl.toggle();
  }

}
