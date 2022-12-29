import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { 
  Category,
  HomeapiServiceProxy,
  Product,
  ProductapiServiceProxy,
  ProductFilterModel,
  ProductResponseModel,
  UserResponseModel,
  VendorapiServiceProxy ,
  VendorWishlist,
  VendorwishlistapiServiceProxy,
  VendorWishListResponseModel,
  ReviewuserapiServiceProxy,
  UserReview,
  ReviewUserResponse,
} 
from 'src/shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConsts } from 'src/shared/AppConsts';
import { AlertController } from '@ionic/angular';  
import { AppSessionService } from 'src/shared/session/app-session.service';

@Component({
  selector: 'app-resturant',
  templateUrl: './resturant.page.html',
  styleUrls: ['./resturant.page.scss'],
})
export class ResturantPage implements OnInit {
  featuredProducts: Product[] = [];
  vendorId: string;
  vendor$: Observable<UserResponseModel>;
  categories$: Observable<Category[]>;
  catSlideOptsR = {
    slidesPerView: 5.7,
    spaceBetween: 5,
  };
  rating;
  currentUserId = "";
  selectedCategory;
  vendorlist :VendorWishListResponseModel[]=[];
  isFav:boolean=false;
  vendorWishListId;
  AppConsts = AppConsts;
  Review: ReviewUserResponse[]=[];
  constructor(
    private _session: AppSessionService,
    private route: ActivatedRoute,
    private _vendorService: VendorapiServiceProxy,
    private _productsService: ProductapiServiceProxy,
    private _homeService: HomeapiServiceProxy,
    private _vendorwishlistService: VendorwishlistapiServiceProxy,
    public alertCtrl: AlertController,
    private _reviewuserService: ReviewuserapiServiceProxy

  ) { }


  

  ngOnInit() {
    this.currentUserId = this._session.userId;
    this.vendor$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.vendorId = params.get('vendorId');
       
        const productFilter = new ProductFilterModel();
        productFilter.init( {
          creatorId: this.vendorId,
          currentPage: 1,
          take: 20
        });
    
        this._productsService.list(productFilter)
        .subscribe((res: ProductResponseModel) => {
          this.featuredProducts = res.products;
        });
        this.getReview(this.vendorId);
        return this._vendorService.vendorbyid(this.vendorId);
      })
    );

    this.categories$ = this._homeService.menu();
    this.isFavVendor();
   
  }

  slidePrev() {

  }

  slideNext() {

  }

  callSupport() {
    
  }


  getReview(vendorId){
   
    this._reviewuserService.getreviewsbyuserid(vendorId).subscribe((res: ReviewUserResponse[]) =>{ this.Review = res
      var sum=0;
      var number=0;
      this.Review.forEach(element=>{
             sum+=element.rating;
             number++;
            });
           var rating=sum/number;
           this.rating=Math.round(rating);
          
        });
     
            
  }
  addReview(rate){
    
      const review = new UserReview();
      review.init({
        userId: this.vendorId,
        raterId:this._session.userId,
        rating:rate
      });

      this._reviewuserService.create(review).subscribe(
        (res) => {    

        },
        async (error) => {
          // Unexpected result!
          // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
          console.log('error ', error);
        });
  }

  async  showAlert(msg) {  
    const alert = await this.alertCtrl.create({  
      header: 'المفضلة',  
      subHeader: '',  
      message:  msg , 
      buttons: ['تم']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);  
  }  
  createVendorWishList(){
    const vendorWishlist = new VendorWishlist();
    vendorWishlist.init({
      vendorId: this.vendorId,
      userId:this._session.userId,
    });
   
    this._vendorwishlistService.createwish(vendorWishlist).subscribe(
      (res) => {
        this.showAlert('تمت إضافة المطعم إلى المفضلة بنجاح!' );  
        this.isFavVendor(); 
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        console.log('error ', error);
      });
  }

  isFavVendor(){
    this._vendorwishlistService.getwishlist(this._session.userId).subscribe((res:VendorWishListResponseModel[])=>{ this.vendorlist = res;
    this.vendorlist.forEach(element=>{
    if( this.vendorId ==element.vendorId)
    {
      this.isFav=true; 
      this.vendorWishListId=element.id;
    }

   });
 });
}

handleRefresh(event) {
  setTimeout(() => {
    this.ngOnInit();
    event.target.complete();
  }, 2000);
};

deleteVendorWishList (){
    this._vendorwishlistService.deletewish(this.vendorWishListId).subscribe((res:boolean)=>{ 
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
