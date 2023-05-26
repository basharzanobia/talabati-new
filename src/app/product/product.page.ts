import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConsts } from 'src/shared/AppConsts';
import { CartStoreService } from 'src/shared/cart/cart-store.service';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AlertController } from '@ionic/angular'; 
import * as moment from 'moment'; 

import {
  Product,
  Varient,
  ProductapiServiceProxy,
  WishlistapiServiceProxy,
  Wishlist,
  WishListModel,
  ReviewproductapiServiceProxy,
  Review,
  VendorapiServiceProxy
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
  restId = "0";
  varientId = 0;
  varientNumber = 0;
  product: Product = new Product();
  varient: Varient = new Varient();
  AppConsts = AppConsts;
  productlist;
  isFav:boolean=false;
  wishListId;
  rating;
  now;
  startTime;
  endTime;
  isClosed = false;

  constructor(
    private _session: AppSessionService,
    private route: ActivatedRoute,
    public cart: CartStoreService,
    private _productsService: ProductapiServiceProxy,
    private _wishlistService: WishlistapiServiceProxy,
    private _productapiService:ReviewproductapiServiceProxy,
    private _vendorService : VendorapiServiceProxy,
    public alertCtrl: AlertController,
    ) { }

  ngOnInit() {
    this.productId =  Number(this.route.snapshot.paramMap.get('productId'));
    this._productsService.single(this.productId)
          .subscribe((res: Product) => {
            this.product = res;
            this.getReview(this.product.review);
            this.varientNumber = this.product.varient.length;
            this.restId = this.product.createdBy;
            this.now = new  Date().toString().split(' ')[4];
            console.log(this.product?.createdBy);
            this._vendorService.vendorbyid(this.product?.createdBy).subscribe((res)=>{
              var start = res.startTime.split(":");
              var end = res.endTime.split(":");
              this.startTime = moment({ hour:+start[0], minute:+start[1] }).format('HH:mm');
              this.endTime = moment({ hour:+end[0], minute:+end[1] }).format('HH:mm');
              console.log(res?.endTime);
              console.log(res?.startTime);
              if((this.startTime > this.now) || ( this.endTime < this.now)){
                    this.isClosed = true;
              }
            })
          });
          this.isFavProduct();   
  }
ionViewDidEnter(){

}
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  };
  
  ChangeVarient(varientId){
    console.log(this.product.productImage);
    this.varient = this.product.varient.find(x=>x.id==varientId);
  }

  addToCart() {   
    this.cart.addToCart({
      productId: this.productId,
      quantity: this.quantity,
      product: this.product,
      varientId : this.varientId,
      varient : this.getVarientById(this.product,this.varientId)
    });
    
  }
 getVarientById(product,id) : Varient{
  var v:Varient = new Varient();
    product.varient.forEach(element => {
      if (element.id==id) {
        v=element;
      }
    });
    return v;
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


