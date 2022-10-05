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
  WishListModel,
  ReviewproductapiServiceProxy,
  Review
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
  productlist;
  isFav:boolean=false;
  wishListId;
  rating;

  constructor(
    private _session: AppSessionService,
    private route: ActivatedRoute,
    public cart: CartStoreService,
    private _productsService: ProductapiServiceProxy,
    private _wishlistService: WishlistapiServiceProxy,
    private _productapiService:ReviewproductapiServiceProxy,
    public alertCtrl: AlertController,
    ) { }

  ngOnInit() {
    this.productId =  Number(this.route.snapshot.paramMap.get('productId'));
    this._productsService.single(this.productId)
          .subscribe((res: Product) => {
            this.product = res;
            this.getReview(this.product.review);
          });
          this.isFavProduct();
         
  }

  addToCart() {
    this.cart.addToCart({
      productId: this.productId,
      quantity: this.quantity,
      product: this.product
    });
    
  }
  async  showAlert(msg) {  
    const alert = await this.alertCtrl.create({  
      header: 'المفضلة',  
      subHeader: '',  
      message: msg,  
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
        this.showAlert('تمت إضافة المنتج إلى المفضلة بنجاح!');   
        this.isFavProduct()
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        console.log('error ', error);
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
            this.rating=Math.round(rating);
  }
  addReview(rate){
    
      const review = new Review();
      review.init({
        productId: this.productId,
        userId:this._session.userId,
        rating:rate
      });

      this._productapiService.create(review).subscribe(
        (res) => {    
          this.getReview(this.product.review);
        },
        async (error) => {
          // Unexpected result!
          // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
          console.log('error ', error);
        });
  }

  isFavProduct(){
    this._wishlistService.getwishlist(this._session.userId).subscribe((res:WishListModel[])=>{ this.productlist = res;
    this.productlist.forEach(element=>{
    if( this.productId ==element.productId)
    {
      this.isFav=true; 
      this.wishListId=element.id;
    }

   });
 });
}

  deleteWishList(){
    this._wishlistService.deletewish(this.wishListId).subscribe((res:boolean)=>{ 
     if(res==true)
     {
      this.showAlert('تمت إزالة المطعم من المفضلة بنجاح!' );
      this.isFav=false;
     }
     else
     this.showAlert('لم تتم إزالة المطعم من المفضلة !');

    });
  }
  }


