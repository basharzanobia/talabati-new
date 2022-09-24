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
  VendorWishListResponseModel} 
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
  catSlideOpts = {
    slidesPerView: 5.7,
    spaceBetween: 5,
  };
  selectedCategory;
  vendorlist :VendorWishListResponseModel[]=[];
  isFav:boolean=false;
  vendorWishListId
  AppConsts = AppConsts;

  constructor(
    private _session: AppSessionService,
    private route: ActivatedRoute,
    private _vendorService: VendorapiServiceProxy,
    private _productsService: ProductapiServiceProxy,
    private _homeService: HomeapiServiceProxy,
    private _vendorwishlistService: VendorwishlistapiServiceProxy,
    public alertCtrl: AlertController

  ) { }


  

  ngOnInit() {
    
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
