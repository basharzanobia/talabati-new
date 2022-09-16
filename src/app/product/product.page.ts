import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from 'src/shared/AppConsts';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AlertController } from '@ionic/angular';  

import {
  Product,
  ProductapiServiceProxy,
  WishlistapiServiceProxy,
  Wishlist,
} 
from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  quantity = 1;
  productId = 1;
  product: Product;
  AppConsts = AppConsts;

  constructor(
    private _session: AppSessionService,
    private route: ActivatedRoute,
    public cart: CartStoreService,
    private _productsService: ProductapiServiceProxy,
    private _wishlistService: WishlistapiServiceProxy,
    public alertCtrl: AlertController
    ) { }

  ngOnInit() {
    this.productId =  Number(this.route.snapshot.paramMap.get('productId'));
    this._productsService.single(this.productId)
          .subscribe((res: Product) => {
            this.product = res;
          });
  }

  addToCart() {
    this.cart.addToCart({
      productId: this.productId,
      quantity: this.quantity,
      product: this.product
    });
    
  }
  async  showAlert() {  
    const alert = await this.alertCtrl.create({  
      header: 'المفضلة',  
      subHeader: '',  
      message: 'تمت إضافة المنتج إلى المفضلة بنجاح!',  
      buttons: ['تم']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);  
  }  
  createWishList(){
    const whishlist = new Wishlist();
    whishlist.init({
      productId: this.productId,
      userId:this._session.userId,
    });
   
    this._wishlistService.createwish(whishlist).subscribe(
      (res) => {
        this.showAlert();   
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        console.log('error ', error);
      });
  }
  }


